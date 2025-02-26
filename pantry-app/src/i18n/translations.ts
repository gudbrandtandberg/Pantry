interface Translations {
    [key: string]: {
        title: string;
        inStock: string;
        shoppingList: string;
        addItem: string;
        createPantry: string;
        selectPantry: string;
        pantryName: string;
        location: string;
        quantity: string;
        unit: string;
        save: string;
        cancel: string;
        noItems: string;
        delete: string;
        moveTo: {
            inStock: string;
            shoppingList: string;
        };
        emptyListMessages: string[];
        login: {
            title: string;
            email: string;
            password: string;
            submit: string;
            error: string;
            continueWith: string;
            google: string;
            tooManyAttempts: string;
            rememberMe: string;
        };
        signOut: string;
    };
}

export const translations: Translations = {
    'no': {
        title: 'Familiens Matskap',  // or a fun family-specific name?
        inStock: 'På Lager',
        shoppingList: 'Handleliste',
        addItem: 'Legg Til',
        createPantry: 'Nytt Matskap',
        selectPantry: 'Velg matskap...',
        pantryName: 'Navn på matskap',
        location: 'Sted',
        quantity: 'Antall',
        unit: 'Enhet (valgfritt)',
        save: 'Lagre',
        cancel: 'Avbryt',
        noItems: 'Ingen varer i listen',
        delete: 'Slett',
        moveTo: {
            inStock: 'Flytt til matskapet',
            shoppingList: 'Flytt til handlelisten'
        },
        emptyListMessages: [
            'Ingenting her ennå! Tid for handling? 🛒',
            'Tom som et norsk kjøleskap før helgen! 😅',
            'Like tomt som en matpakke på fredag! 🥪',
            'På tide å fylle opp igjen! 🛍️'
        ],
        login: {
            title: 'Logg inn',
            email: 'E-post',
            password: 'Passord',
            submit: 'Logg inn',
            error: 'Feil e-post eller passord',
            continueWith: 'Fortsett med',
            google: 'Google',
            tooManyAttempts: 'For mange forsøk. Vennligst prøv igjen senere.',
            rememberMe: 'Husk meg'
        },
        signOut: 'Logg ut'
    },
    'en': {
        title: 'Family Pantry',
        inStock: 'In Stock',
        shoppingList: 'Shopping List',
        addItem: 'Add Item',
        createPantry: 'New Pantry',
        selectPantry: 'Select pantry...',
        pantryName: 'Pantry Name',
        location: 'Location',
        quantity: 'Quantity',
        unit: 'Unit (optional)',
        save: 'Save',
        cancel: 'Cancel',
        noItems: 'No items in list',
        delete: 'Delete',
        moveTo: {
            inStock: 'Move to Stock',
            shoppingList: 'Move to Shopping List'
        },
        emptyListMessages: [
            'Nothing here yet! Time to shop? 🛒',
            'Empty as a Norwegian fridge before the weekend! 😅',
            'As empty as a lunchbox on Friday! 🥪',
            'Time to stock up! 🛍️'
        ],
        login: {
            title: 'Sign In',
            email: 'Email',
            password: 'Password',
            submit: 'Sign In',
            error: 'Invalid email or password',
            continueWith: 'Continue with',
            google: 'Google',
            tooManyAttempts: 'Too many attempts. Please try again later.',
            rememberMe: 'Remember me'
        },
        signOut: 'Sign Out'
    }
};

// You could add fun, family-specific locations
export const familyLocations = [
    'Hjemme',
    'Hytta i Fjellet',
    'Hytta ved Sjøen',
    // Add your family's specific locations
];

// Common units in Norwegian
export const commonUnits = [
    'stk',
    'kg',
    'g',
    'l',
    'dl',
    'pk',
    'boks',
    'pose',
    // Add more as needed
]; 