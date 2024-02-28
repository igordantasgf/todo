from config import db

# models
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(50))
    status = db.Column(db.String(20))  # Assuming status can be represented as a string

    def to_json(self):
        return {
            "id": self.id,
            "message": self.message,
            "status": self.status
        }
