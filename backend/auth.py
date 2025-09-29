from flask import Flask, request, jsonify, app, current_app, Blueprint
from database import db
from models import User
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# pip install flask-jwt-extended
from werkzeug.security import  generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'], endpoint='register')
def register():
    try:
        data = request.get_json()
        required_fields = ['email', 'password', 'first_name', 'last_name']

        for field in required_fields:
            if not data.get(field):
                return  jsonify({'error': f'поле {field}  обязательно'}), 400

        if User.query.filter_by(email=data.get(data['email'])).first():
            return jsonify({'error': 'такой пользователь уже существует '}), 409

        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone')
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()


        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'success',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/login', methods=['POST'], endpoint='login')
def login():
    try:
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'no required fields'}), 400
        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not user.check_password(data.get('password')):
            return jsonify({'error': 'неверный логин или пароль'}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({
            'message': 'success',
            'access_token': access_token,
            'user': user.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/logout')
@jwt_required()
def logout():
    pass


@auth_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    pass



