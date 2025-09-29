from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from models import Category, Product, Brand, setup_relationships
from config import Config
from auth import auth_bp
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token', 'details': str(error)}), 422

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Missing authorization token'}), 401

    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()
        setup_relationships()
        if Category.query.count() == 0:
            init_sample_data()

    @app.route('/api/products', methods=['GET'])
    def get_products():
        try:
            category_filter = request.args.get('category')
            min_price_filter = request.args.get('minPrice')
            max_price_filter = request.args.get('maxPrice')

            query = Product.query

            if category_filter:
                category_slugs = [slug.strip()
                                  for slug in category_filter.split(',')
                                  if slug.strip()]
                if category_slugs:
                    query = query.join(Category).filter(Category.slug.in_(category_slugs))
            if min_price_filter:
                try:
                    min_price_float = float(min_price_filter)
                    query = query.filter(Product.price > min_price_float)
                except ValueError:
                    pass
            if max_price_filter:
                try:
                    max_price_float = float(max_price_filter)
                    query = query.filter(Product.price < max_price_float)
                except ValueError:
                    pass

            products = query.all()
            products_data = [product.to_dict() for product in products]
            return jsonify(products_data)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        try:
            categories = Category.query.all()
            categories_data = [category.to_dict()
                               for category in categories]
            return jsonify(categories_data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app

def init_sample_data():
    categories_data = [
        {'name': 'Электроника', 'slug': 'electronics'},
        {'name': 'Одежда', 'slug': 'clothing'},
        {'name': 'Книги', 'slug': 'books'},
        {'name': 'Спорт', 'slug': 'sports'}
    ]

    categories = {}
    for cat_data in categories_data:
        category = Category(name=cat_data['name'], slug=cat_data['slug'])
        db.session.add(category)
        db.session.flush()  # Чтобы получить ID
        categories[cat_data['slug']] = category

    brands_data = [
        {'name': 'Samsung', 'slug': 'samsung'},
        {'name': 'Apple', 'slug': 'apple'},
        {'name': 'Nike', 'slug': 'nike'},
        {'name': 'Adidas', 'slug': 'adidas'}
    ]

    brands = {}
    for brand_data in brands_data:
        brand = Brand(name=brand_data['name'], slug=brand_data['slug'])
        db.session.add(brand)
        db.session.flush()
        brands[brand_data['slug']] = brand

    # Создание товаров
    products_data = [
        {
            'name': 'Смартфон Samsung Galaxy',
            'description': 'Мощный смартфон с отличной камерой',
            'price': 29999.99,
            'image_url': 'https://example.com/phone.jpg',
            'stock_quantity': 10,
            'category_slug': 'electronics',
            'brand_slug': 'samsung'
        },
        {
            'name': 'Футболка Nike',
            'description': 'Спортивная футболка из дышащего материала',
            'price': 1999.99,
            'image_url': 'https://example.com/shirt.jpg',
            'stock_quantity': 25,
            'category_slug': 'clothing',
            'brand_slug': 'nike'
        },
        {
            'name': 'Книга по программированию',
            'description': 'Подробное руководство по React и Node.js',
            'price': 1499.99,
            'image_url': 'https://example.com/book.jpg',
            'stock_quantity': 15,
            'category_slug': 'books',
            'brand_slug': None
        },
        {
            'name': 'Беговые кроссовки Adidas',
            'description': 'Легкие и удобные кроссовки для бега',
            'price': 4999.99,
            'image_url': 'https://example.com/shoes.jpg',
            'stock_quantity': 8,
            'category_slug': 'sports',
            'brand_slug': 'adidas'
        }
    ]

    for product_data in products_data:
        product = Product(
            name=product_data['name'],
            description=product_data['description'],
            price=product_data['price'],
            image_url=product_data['image_url'],
            stock_quantity=product_data['stock_quantity'],
            category_id=categories[product_data['category_slug']].id,
            brand_id=brands[product_data['brand_slug']].id if product_data['brand_slug'] else None
        )
        db.session.add(product)

    db.session.commit()
    print("добавлены")

if __name__ == '__main__':

    app = create_app()
    app.run(debug=True, port=5000)