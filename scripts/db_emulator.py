from firebase_admin import credentials, initialize_app, firestore
from datetime import datetime
import uuid
import os

# Initialize Firebase Admin with emulator
os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
initialize_app(options={'projectId': 'tandberg-pantry'})
db = firestore.client()

# Constants
TEST_USER_ID = 's1isQk9Oon02UQQ1xQ8R1XDHV9DD'  # Your existing auth user ID
TEST_EMAIL = 'test@example.com'

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
    
    # Create user
    print(f'Creating user: {TEST_EMAIL} (ID: {TEST_USER_ID})')
    db.collection('users').document(TEST_USER_ID).set({
        'id': TEST_USER_ID,
        'email': TEST_EMAIL,
        'displayName': 'Test User',
        'preferences': {'language': 'no'},
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })

    # Sample pantries data
    pantries = [
        {
            'name': 'Home Kitchen',
            'location': 'Hjemme',
            'inStock': [
                {'id': str(uuid.uuid4()), 'name': 'Milk', 'quantity': 2, 'unit': 'l', 'lastUpdated': datetime.now().timestamp()},
                {'id': str(uuid.uuid4()), 'name': 'Bread', 'quantity': 1, 'unit': 'loaf', 'lastUpdated': datetime.now().timestamp()},
            ],
            'shoppingList': [
                {'id': str(uuid.uuid4()), 'name': 'Tomatoes', 'quantity': 6, 'unit': 'pcs', 'lastUpdated': datetime.now().timestamp()},
            ]
        },
        {
            'name': 'Mountain Cabin',
            'location': 'Hytta i Fjellet',
            'inStock': [
                {'id': str(uuid.uuid4()), 'name': 'Coffee', 'quantity': 1, 'unit': 'kg', 'lastUpdated': datetime.now().timestamp()},
            ],
            'shoppingList': [
                {'id': str(uuid.uuid4()), 'name': 'Toilet Paper', 'quantity': 8, 'unit': 'rolls', 'lastUpdated': datetime.now().timestamp()},
            ]
        }
    ]

    # Create pantries
    print('\nCreating pantries:')
    for pantry in pantries:
        pantry_id = str(uuid.uuid4())
        
        # Add metadata
        pantry['id'] = pantry_id
        pantry['createdBy'] = TEST_USER_ID
        pantry['createdAt'] = datetime.now()
        pantry['updatedAt'] = datetime.now()
        
        # Create pantry document
        db.collection('pantries').document(pantry_id).set(pantry)
        
        # Add owner as member
        db.collection('pantries').document(pantry_id).collection('members').document(TEST_USER_ID).set({
            'userId': TEST_USER_ID,
            'role': 'owner',
            'joinedAt': datetime.now()
        })
        
        print(f'  - Created pantry: {pantry["name"]} (ID: {pantry_id})')
        print(f'    • Items in stock: {len(pantry["inStock"])}')
        print(f'    • Items in shopping list: {len(pantry["shoppingList"])}')
        print(f'    • Added owner as member')

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