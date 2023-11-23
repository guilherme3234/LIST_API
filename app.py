# Importa as bibliotecas necessárias
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

# Cria a aplicação Flask
app = Flask(__name__)
CORS(app)

# Tenta criar o arquivo Text.csv caso ele não exista e escreve o cabeçalho
try:
    open('Text.csv', 'x')
    with open("Text.csv", "a", encoding='utf-8') as arquivo:    # Cria o arquivo Text.csv com leitura de UTF-8
         arquivo.write("ID,TAREFA\n") 
except:
    pass

# Define a rota para listar as tarefas
@app.route("/list", methods=['GET'])
def listarTarefas():    
    # Lê o arquivo Text.csv e converte para um dicionário
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')    
    # Retorna as tarefas em formato JSON
    return jsonify(tarefas)

# Define a rota para adicionar uma tarefa
@app.route("/add", methods=['POST'])
def addTarefas():
    # Obtém a tarefa enviada pelo cliente
    item = request.json  
    # Lê o arquivo Text.csv e converte para um dicionário
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records') 
    # Define o ID da nova tarefa
    id = len(tarefas) + 1
    # Adiciona a nova tarefa ao arquivo Text.csv
    with open("Text.csv", "a", encoding='utf-8') as arquivo:
         arquivo.write(f"{id},{item['Tarefa']}\n")    
    # Lê o arquivo Text.csv e converte para um dicionário
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')        
    # Retorna as tarefas em formato JSON
    return jsonify(tarefas)

# Define a rota para deletar uma tarefa
@app.route("/delete", methods=['DELETE'])
def deleteTarefa():
    # Obtém o ID da tarefa a ser deletada do corpo da requisição
    data = request.json
    id = data.get('id')

    # Verifica se o ID foi fornecido
    if id is None:
        return jsonify({"error": "ID da tarefa não fornecido"}), 400

    # Lê o arquivo Text.csv e converte para um DataFrame
    tarefas = pd.read_csv('Text.csv')

    # Verifica se a tarefa com o ID fornecido existe
    if id not in tarefas['ID'].values:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    # Remove a tarefa com o ID fornecido
    tarefas = tarefas.drop(tarefas[tarefas['ID'] == id].index)

    # Reajusta os IDs após a exclusão
    tarefas['ID'] = range(1, len(tarefas) + 1)

    # Salva as alterações no arquivo Text.csv
    tarefas.to_csv('Text.csv', index=False)

    # Retorna as tarefas atualizadas em formato JSON
    return jsonify(tarefas.to_dict('records'))

# Define a rota para atualizar uma tarefa
@app.route("/update/<int:id>", methods=["PUT"])
def updateTarefa(id):
    # Obtém os dados atualizados do corpo da requisição
    nova_tarefa = request.json.get('TAREFA')

    # Lê o arquivo Text.csv e converte para um DataFrame
    tarefas = pd.read_csv('Text.csv')

    # Verifica se a tarefa com o ID fornecido existe
    if id not in tarefas['ID'].values:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    # Atualiza a tarefa com o ID fornecido
    tarefas.loc[tarefas['ID'] == id, 'TAREFA'] = nova_tarefa

    # Salva as alterações no arquivo Text.csv
    tarefas.to_csv('Text.csv', index=False)

    # Retorna as tarefas atualizadas em formato JSON
    return jsonify(tarefas.to_dict('records'))

# Inicia a aplicação Flask
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
