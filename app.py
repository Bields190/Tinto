"""
Aplicação web Tinto com Flask e Jungle (AWS)
"""
from flask import Flask, render_template, jsonify
import jungle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'


@app.route('/')
def index():
    """Página inicial do webapp"""
    return render_template('index.html')


@app.route('/api/status')
def api_status():
    """Endpoint de API para verificar status"""
    return jsonify({
        'status': 'online',
        'backend': 'jungle',
        'message': 'Webapp Tinto está funcionando!'
    })


@app.route('/about')
def about():
    """Página sobre o projeto"""
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
