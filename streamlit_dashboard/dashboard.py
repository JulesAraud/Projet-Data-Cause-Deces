import streamlit as st
import pandas as pd
import plotly.express as px
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os

# Configuration
st.set_page_config(layout="wide", page_title="Analyse des causes de décès")

# Load environment variables
load_dotenv()

@st.cache_data
def load_data():
    try:
        client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
        db = client[os.getenv("DB_NAME")]
        collection = db[os.getenv("COLLECTION_NAME")]
        return pd.DataFrame(list(collection.find()))
    except Exception as e:
        st.error(f"Erreur de connexion à MongoDB: {str(e)}")
        return pd.DataFrame()

# Load data
data = load_data()

if not data.empty:
    # Sidebar filters
    st.sidebar.header("Filtres")
    
    # Country selection
    countries = st.sidebar.multiselect(
        "Choisissez un ou plusieurs pays :",
        options=sorted(data["Country/Territory"].unique()),
        default=["France", "United States"] if {"France", "United States"}.issubset(data["Country/Territory"].unique()) else []
    )
    
    # Year range selection
    year_range = st.sidebar.slider(
        "Sélectionnez une plage d'années :",
        min_value=int(data['Year'].min()),
        max_value=int(data['Year'].max()),
        value=(int(data['Year'].min()), int(data['Year'].max()))
    )
    
    # Cause of death selection
    causes = sorted([col for col in data.columns if col not in 
                   ["_id", "Country/Territory", "Code", "Year"]])
    selected_causes = st.sidebar.multiselect(
        "Sélectionnez les causes à analyser :",
        options=causes,
        default=causes[:3]  # Default to first 3 causes
    )
    
    # Apply filters
    filtered_data = data[
        (data["Country/Territory"].isin(countries) if countries else True
    )].query(
        f"Year >= {year_range[0]} and Year <= {year_range[1]}"
    )
    
    # Main display
    st.title("Analyse des causes de décès par pays")
    
    # Metrics overview
    if not filtered_data.empty and countries:
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Nombre de pays", len(filtered_data["Country/Territory"].unique()))
        with col2:
            st.metric("Plage d'années", f"{year_range[0]} - {year_range[1]}")
        with col3:
            avg_deaths = int(filtered_data[selected_causes].mean().mean())
            st.metric("Moyenne de décès (causes sélectionnées)", f"{avg_deaths:,}")
    
    # Data visualization tabs
    tab1, tab2, tab3 = st.tabs(["Évolution temporelle", "Comparaison par pays", "Données brutes"])
    
    with tab1:
        if selected_causes:
            fig = px.line(
                filtered_data,
                x="Year",
                y=selected_causes,
                color="Country/Territory",
                title="Évolution des causes de décès au fil du temps",
                labels={"value": "Nombre de décès", "variable": "Cause de décès"}
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Veuillez sélectionner au moins une cause de décès")
    
    with tab2:
        if selected_causes and not filtered_data.empty:
            agg_data = filtered_data.groupby("Country/Territory")[selected_causes].mean().reset_index()
            fig = px.bar(
                agg_data,
                x="Country/Territory",
                y=selected_causes,
                barmode="group",
                title="Comparaison moyenne des causes de décès par pays",
                labels={"value": "Nombre moyen de décès", "variable": "Cause de décès"}
            )
            st.plotly_chart(fig, use_container_width=True)
    
    with tab3:
        st.dataframe(
            filtered_data.drop(columns=["_id"]).sort_values(["Country/Territory", "Year"]),
            height=500,
            use_container_width=True
        )
        
    # Download button
    st.download_button(
        label="Télécharger les données filtrées",
        data=filtered_data.to_csv(index=False).encode('utf-8'),
        file_name='donnees_deces_filtrees.csv',
        mime='text/csv'
    )
else:
    st.warning("Aucune donnée disponible. Veuillez vérifier votre connexion à la base de données.")