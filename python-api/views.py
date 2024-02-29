from models import Todo, db
from config import app
from flask import Response, request
import json

# Selecionar Tudo
@app.route("/mensagens", methods=["GET"])
def seleciona_mensagens():
    mensagens_objetos = Todo.query.all()
    mensagens_json = [mensagem.to_json() for mensagem in mensagens_objetos]

    return gera_response(200, "mensagens", mensagens_json)


# Adicionar mensagem na todo
@app.route("/mensagens", methods=["POST"])
def insere_mensagem():
    data = request.get_json()
    message = data.get('message') # Exige request  com o JSON {"message": "Mensagem"}

    if not message:
        return gera_response(400, "mensagem não fornecida", None)

    new_todo_item = Todo(message=message, status="Em progresso")

    db.session.add(new_todo_item)
    db.session.commit()

    return gera_response(201, "inserido", new_todo_item.to_json())


#Update no status do item todo
@app.route("/mensagens/<int:id>/status", methods=["PUT"])
def atualiza_status(id):
    data = request.get_json()
    new_status = data.get('status')# Exige request com o JSON  {"status":"Pronto"}

    if not new_status:
        return gera_response(400, "novo status não fornecido", None)

    todo_item = Todo.query.get(id)

    if not todo_item:
        return gera_response(404, "mensagem não encontrada", None)

    todo_item.status = new_status
    db.session.commit()

    return gera_response(200, "status atualizado com sucesso", todo_item.to_json())


#Deletar item todo
@app.route("/mensagens/<int:id>", methods=["DELETE"])
def deleta_mensagem(id):
    mensagem_objeto = Todo.query.filter_by(id=id).first()

    if not mensagem_objeto:
        return gera_response(404, "mensagem não encontrada", None)

    db.session.delete(mensagem_objeto)
    db.session.commit()

    return gera_response(200, "mensagem deletada", mensagem_objeto.to_json())


# Teste
@app.route("/")
def home():
    return "Hello World, from Flask!"

#Modelo response
def gera_response(status, nome_do_conteudo, conteudo, mensagem=False):
    body = {}
    body[nome_do_conteudo] = conteudo

    if(mensagem):
        body["mensagem"] = mensagem

    return Response(json.dumps(body), status=status, mimetype="application/json")
