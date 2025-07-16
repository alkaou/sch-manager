#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fichier de correction CORS pour le serveur Flask de Fatoumata AI

Ce fichier contient les configurations nécessaires pour résoudre les problèmes CORS
entre l'application React (localhost:3000) et le serveur Flask (127.0.0.1:5000).

Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
"""

from flask import Flask
from flask_cors import CORS

def configure_cors(app):
    """
    Configure CORS pour l'application Flask
    
    Args:
        app: Instance de l'application Flask
    """
    # Configuration CORS complète
    CORS(app, 
         origins=[
             "http://localhost:3000",
             "http://127.0.0.1:3000",
             "http://localhost:3001",
             "http://127.0.0.1:3001"
         ],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=[
             "Content-Type",
             "Authorization",
             "Accept",
             "Origin",
             "X-Requested-With"
         ],
         supports_credentials=True
    )
    
    # Ajouter les en-têtes CORS manuellement pour plus de compatibilité
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    # Gérer les requêtes OPTIONS (preflight)
    @app.route('/<path:path>', methods=['OPTIONS'])
    @app.route('/', methods=['OPTIONS'])
    def handle_options(path=None):
        response = app.make_default_options_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

# Exemple d'utilisation dans votre serveur Flask principal
if __name__ == "__main__":
    app = Flask(__name__)
    configure_cors(app)
    
    @app.route('/chat', methods=['POST'])
    def chat_endpoint():
        # Votre logique de chat ici
        return {"reply": "Test de réponse"}
    
    app.run(host='127.0.0.1', port=5000, debug=True)