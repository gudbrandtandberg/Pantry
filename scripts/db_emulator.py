import firebase_admin
from firebase_admin import firestore
import datetime
import os

# Initialize Firebase Admin with emulator
firebase_admin.initialize_app(options={
    'projectId': 'tandberg-pantry',
})

# Configure to use emulator
os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
db = firestore.client()

# Constants
TEST_USER_ID = 's1isQk9Oon02UQQ1xQ8R1XDHV9DD'  # Your existing auth user ID
TEST_EMAIL = 'test@example.com'
BEST_USER_ID = 'YOcI5i2K04X8KgVoU0xoll5WHS2K'
BEST_USER_EMAIL = 'best@example.com'

def clear_collections():
    print('Clearing emulator data...')
    collections = ['users', 'pantries', 'invites']
    for collection in collections:
        print(f'Clearing collection: {collection}')
        docs = db.collection(collection).get()
        for doc in docs:
            doc.reference.delete()
    print('Emulator data cleared!')

def create_users():
    print('Creating test users...')
    users = [
        {
            'id': TEST_USER_ID,
            'email': TEST_EMAIL,
            'displayName': 'Test User',
            'preferences': {'language': 'en'},
            'createdAt': datetime.datetime.now(),
            'updatedAt': datetime.datetime.now()
        },
        {
            'id': BEST_USER_ID,
            'email': BEST_USER_EMAIL,
            'displayName': 'Best User',
            'preferences': {'language': 'no'},
            'createdAt': datetime.datetime.now(),
            'updatedAt': datetime.datetime.now()
        }
    ]
    
    for user in users:
        print(f'Creating user: {user["email"]} (ID: {user["id"]})')
        db.collection('users').document(user['id']).set(user)

def create_pantries():
    print('Creating test pantries...')
    pantries = [
        {
            'id': 'test-pantry-id',
            'name': 'Test Pantry',
            'location': 'Home',
            'createdBy': TEST_USER_ID,
            'createdAt': datetime.datetime.now(),
            'updatedAt': datetime.datetime.now(),
            'members': {
                TEST_USER_ID: {
                    'role': 'owner',
                    'addedAt': datetime.datetime.now(),
                    'addedBy': TEST_USER_ID
                }
            },
            'inStock': [
                {
                    'id': 'milk-id',
                    'name': 'Milk',
                    'quantity': 2,
                    'unit': 'l',
                    'lastUpdated': datetime.datetime.now()
                },
                {
                    'id': 'bread-id',
                    'name': 'Bread',
                    'quantity': 1,
                    'unit': 'pcs',
                    'lastUpdated': datetime.datetime.now()
                }
            ],
            'shoppingList': [
                {
                    'id': 'cheese-id',
                    'name': 'Cheese',
                    'quantity': 1,
                    'unit': 'kg',
                    'lastUpdated': datetime.datetime.now()
                }
            ],
            'inviteLinks': {}
        },
        {
            'id': 'best-pantry-id',
            'name': 'Best Pantry',
            'location': 'Mountain Cabin',
            'createdBy': BEST_USER_ID,
            'createdAt': datetime.datetime.now(),
            'updatedAt': datetime.datetime.now(),
            'members': {
                BEST_USER_ID: {
                    'role': 'owner',
                    'addedAt': datetime.datetime.now(),
                    'addedBy': BEST_USER_ID
                }
            },
            'inStock': [],
            'shoppingList': [],
            'inviteLinks': {}
        }
    ]
    
    for pantry in pantries:
        print(f'Creating pantry: {pantry["name"]} (ID: {pantry["id"]})')
        db.collection('pantries').document(pantry['id']).set(pantry)

def main():
    try:
        clear_collections()
        create_users()
        create_pantries()
        print('\nEmulator setup complete!')
    except Exception as e:
        print(f'Error setting up emulator: {e}')

if __name__ == '__main__':
    main() 