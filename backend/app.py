from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import random
import string
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # 更改为复杂的密钥
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = True  # 在生产环境中使用 HTTPS
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
jwt = JWTManager(app)

# 模拟用户数据库
users = {}

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    if username in users:
        return jsonify({"msg": "Username already exists"}), 400
    users[username] = generate_password_hash(password)
    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    if username not in users or not check_password_hash(users[username], password):
        return jsonify({"msg": "Bad username or password"}), 401
    
    access_token = create_access_token(identity=username, expires_delta=timedelta(days=7))
    response = jsonify({"msg": "Login successful"})
    response.set_cookie('access_token_cookie', access_token, httponly=True, secure=True, samesite='Strict', max_age=60*60*24*7)  # 7 days
    return response

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Logout successful"})
    response.set_cookie('access_token_cookie', '', expires=0)
    return response

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

def generate_verification_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/send-verification', methods=['POST'])
def send_verification():
    email = request.json['email']
    code = generate_verification_code()
    
    message = Mail(
        from_email='your-email@example.com',
        to_emails=email,
        subject='Your Verification Code',
        html_content=f'Your verification code is: <strong>{code}</strong>')
    
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        return jsonify({"message": "Verification code sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
