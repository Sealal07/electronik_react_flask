from flask import request, jsonify, Blueprint
from database import db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        required_fields = ['email', 'password', 'first_name', 'last_name']

        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'поле {field} обязательно'}), 400

        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'такой пользователь уже существует'}), 409

        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone')
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'success',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'no required fields'}), 400

        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not user.check_password(data.get('password')):
            return jsonify({'error': 'неверный логин или пароль'}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'success',
            'access_token': access_token,
            'user': user.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        return jsonify({
            'message': 'Успешный выход из системы'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        return jsonify({
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user:
            return jsonify({'error': 'Пользователь не найден'}), 404

        data = request.get_json()

        if not data.get('first_name') or not data.get('last_name'):
            return jsonify({'error': 'Поля first_name и last_name обязательны'}), 400

        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone = data.get('phone', user.phone)

        db.session.commit()

        return jsonify({
            'message': 'Профиль успешно обновлен',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500