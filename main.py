from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap5

# Database URI
DATABASE_URI = 'sqlite:///todo.db'
app = Flask(__name__)
Bootstrap5(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI

db = SQLAlchemy()
db.init_app(app)


class Task(db.Model):
    query: db.Query = db.session.query_property()  # this is if we want to have auto-complete
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=False)
    state = db.Column(db.Boolean, default=True)


# # Create table schema in the database. Requires application context.
# with app.app_context():
#     db.create_all()

# Home page
@app.route('/')
def home():
    result = db.session.execute(db.select(Task))
    tasks = result.scalars().all()

    return render_template('index.html', tasks=tasks)


@app.route('/get_data', methods=['GET'])
def get_data():
    # Retrieve data from the database
    data = Task.query.all()

    # Convert the data to a list of dictionaries
    data_list = [{'id': item.id, 'description': item.description, 'state': item.state} for item in data]

    return jsonify(data_list)


@app.route('/save_data', methods=['POST'])
def save_data():
    button_state = request.json.get('buttonState')  # Assuming the state is sent as JSON
    button_id = request.json.get('id')  # Assuming the state is sent as JSON
    # Process and save the data to the database
    task = db.get_or_404(Task, button_id)
    task.state = button_state
    db.session.commit()
    # Replace with your actual data saving code
    return jsonify({'message': 'Data saved successfully'})


@app.route('/add_task', methods=['POST'])
def add_task():
    task_text = request.form.get('content') # we get this from AJAX request xhr.send('content=' + content);
    if task_text != "":
        task = Task(
            description=task_text
        )
        db.session.add(task)
        db.session.commit()
    return jsonify({'description': task.description})





if __name__ == "__main__":
    app.run(debug=False, port=5001)


