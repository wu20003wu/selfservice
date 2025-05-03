# app/routes/__init__.py
from flask import Blueprint

bp = Blueprint('routes', __name__)  # Erstelle einen Blueprint

from . import routes_adm, routes_api, routes_ath  # Importiere die Routen-Module