from firebase_admin import credentials, initialize_app, firestore
from datetime import datetime
import uuid
import os
import time

# Initialize Firebase Admin with emulator
os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
initialize_app(options={'projectId': 'tandberg-pantry'})
db = firestore.client()

# Constants
TEST_USER_ID = 's1isQk9Oon02UQQ1xQ8R1XDHV9DD'  # Your existing auth user ID
TEST_EMAIL = 'test@example.com'
SECOND_USER_ID = 'YOcI5i2K04X8KgVoU0xoll5WHS2K'
SECOND_USER_EMAIL = 'best@example.com'

def clear_emulator():
    print('Clearing emulator data...')
    for collection in ['users', 'pantries']:
        print(f'Clearing collection: {collection}')
        docs = db.collection(collection).get()
        doc_count = 0
        for doc in docs:
            # Delete subcollections first
            if collection == 'pantries':
                members = doc.reference.collection('members').get()
                member_count = 0
                for member in members:
                    member.reference.delete()
                    member_count += 1
                if member_count > 0:
                    print(f'  - Deleted {member_count} members from pantry {doc.id}')
            # Delete main document
            doc.reference.delete()
            doc_count += 1
        print(f'  - Deleted {doc_count} documents from {collection}')
    print('Emulator data cleared!')

def populate_emulator():
    print('Populating emulator with sample data...')
    
    # Create users
    print(f'Creating user: {TEST_EMAIL} (ID: {TEST_USER_ID})')
    db.collection('users').document(TEST_USER_ID).set({
        'id': TEST_USER_ID,
        'email': TEST_EMAIL,
        'displayName': 'Test User',
        'preferences': {'language': 'no'},
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })

    print(f'Creating user: {SECOND_USER_EMAIL} (ID: {SECOND_USER_ID})')
    db.collection('users').document(SECOND_USER_ID).set({
        'id': SECOND_USER_ID,
        'email': SECOND_USER_EMAIL,
        'displayName': 'Best User',
        'preferences': {'language': 'ru'},
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })

    # Create sample pantries
    pantries_ref = db.collection('pantries')
    
    home_pantry = {
        'id': 'pantry1',
        'name': 'Home',
        'location': 'Hjemme',
        'createdBy': TEST_USER_ID,
        'createdAt': int(time.time() * 1000),
        'updatedAt': int(time.time() * 1000),
        'inStock': [
            {
                'id': 'item1',
                'name': 'Milk',
                'quantity': 2,
                'unit': 'l',
                'lastUpdated': int(time.time() * 1000)
            },
            {
                'id': 'item2',
                'name': 'Coffee',
                'quantity': 1,
                'unit': 'kg',
                'lastUpdated': int(time.time() * 1000)
            }
        ],
        'shoppingList': [
            {
                'id': 'item3',
                'name': 'Bread',
                'quantity': 1,
                'unit': 'pcs',
                'lastUpdated': int(time.time() * 1000)
            },
            {
                'id': 'item4',
                'name': 'Tomatoes',
                'quantity': 6,
                'unit': 'pcs',
                'lastUpdated': int(time.time() * 1000)
            }
        ],
        'members': {
            TEST_USER_ID: {
                'role': 'owner',
                'addedAt': int(time.time() * 1000),
                'addedBy': TEST_USER_ID
            }
        }
    }
    
    cabin_pantry = {
        'id': 'pantry2',
        'name': 'Mountain Cabin',
        'location': 'Hytta i Fjellet',
        'createdBy': TEST_USER_ID,
        'createdAt': int(time.time() * 1000),
        'updatedAt': int(time.time() * 1000),
        'inStock': [
            {
                'id': 'item5',
                'name': 'Coffee',
                'quantity': 1,
                'unit': 'kg',
                'lastUpdated': int(time.time() * 1000)
            }
        ],
        'shoppingList': [
            {
                'id': 'item6',
                'name': 'Toilet Paper',
                'quantity': 8,
                'unit': 'rolls',
                'lastUpdated': int(time.time() * 1000)
            }
        ],
        'members': {
            TEST_USER_ID: {
                'role': 'owner',
                'addedAt': int(time.time() * 1000),
                'addedBy': TEST_USER_ID
            }
        }
    }
    
    # Set the documents with specific IDs
    pantries_ref.document('pantry1').set(home_pantry)
    pantries_ref.document('pantry2').set(cabin_pantry)

    print('\nPopulation complete!')

def reset_emulator():
    try:
        clear_emulator()
        populate_emulator()
        print('Emulator reset complete!')
    except Exception as e:
        print(f'Error resetting emulator: {e}')

if __name__ == '__main__':
    import sys
    command = sys.argv[1] if len(sys.argv) > 1 else 'reset'
    
    if command == 'clear':
        clear_emulator()
    elif command == 'populate':
        populate_emulator()
    else:
        reset_emulator() 