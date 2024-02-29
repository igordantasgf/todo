from config import db

# Modelo de todo
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(50))
    status = db.Column(db.String(20))

    def to_json(self):
        return {
            "id": self.id,
            "message": self.message,
            "status": self.status
        }
