from setuptools import setup, find_packages

requires = [
    'pyramid',
    'waitress',
    'sqlalchemy',
    'psycopg2-binary',
    'alembic',
]

setup(
    name='stocksphere',
    version='0.1',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = stocksphere:main',
        ],
    },
)
