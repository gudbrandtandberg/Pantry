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
        itemName: string;
        add: string;
        remove: string;
        moveToShoppingList: string;
        moveToInStock: string;
    };
}

export const translations: Translations = {
    'no': {
        title: 'Familiens Matskap',  // or a fun family-specific name?
        inStock: 'På lager',
        shoppingList: 'Handleliste',
        addItem: 'Legg Til',
        createPantry: 'Nytt Matskap',
        selectPantry: 'Velg matskap...',
        pantryName: 'Navn på matskap',
        location: 'Sted',
        quantity: 'Antall',
        unit: 'Enhet',
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
        signOut: 'Logg ut',
        itemName: 'Varenavn',
        add: 'Legg til',
        remove: 'Fjern',
        moveToShoppingList: 'Flytt til handleliste',
        moveToInStock: 'Flytt til lager'
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
        unit: 'Unit',
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
        signOut: 'Sign Out',
        itemName: 'Item name',
        add: 'Add',
        remove: 'Remove',
        moveToShoppingList: 'Move to shopping list',
        moveToInStock: 'Move to stock'
    },
    'ru': {
        title: 'Семейная Кладовая',
        inStock: 'В Наличии',
        shoppingList: 'Список Покупок',
        addItem: 'Добавить',
        createPantry: 'Новая Кладовая',
        selectPantry: 'Выберите кладовую...',
        pantryName: 'Название Кладовой',
        location: 'Место',
        quantity: 'Количество',
        unit: 'Единица (необязательно)',
        save: 'Сохранить',
        cancel: 'Отмена',
        noItems: 'Список пуст',
        delete: 'Удалить',
        moveTo: {
            inStock: 'Переместить в Наличие',
            shoppingList: 'Переместить в Список Покупок'
        },
        emptyListMessages: [
            'Пока ничего нет! Пора за покупками? 🛒',
            'Пусто как в холодильнике перед выходными! 😅',
            'Пусто как в ланч-боксе в пятницу! 🥪',
            'Пора пополнить запасы! 🛍️'
        ],
        login: {
            title: 'Вход',
            email: 'Эл. почта',
            password: 'Пароль',
            submit: 'Войти',
            error: 'Неверная почта или пароль',
            continueWith: 'Продолжить через',
            google: 'Google',
            tooManyAttempts: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
            rememberMe: 'Запомнить меня'
        },
        signOut: 'Выйти',
        itemName: 'Название товара',
        add: 'Добавить',
        remove: 'Удалить',
        moveToShoppingList: 'Переместить в список покупок',
        moveToInStock: 'Переместить в наличие'
    }
};

// Family-specific locations with translations
export const familyLocations = [
    'Hjemme',        // Norwegian
    'Home',          // English
    'Дом',           // Russian
    'Hytta i Fjellet',
    'Mountain Cabin',
    'Горная Хижина',
    'Hytta ved Sjøen',
    'Beach House',
    'Дом у Моря',
];

// Common units in Norwegian and Russian
export const commonUnits = [
    'stk',
    'kg',
    'g',
    'l',
    'dl',
    'pk',
    'boks',
    'pose',
    'шт',    // pieces
    'уп',    // package
    'кг',    // kilogram
    'г',     // gram
    'л',     // liter
    'мл',    // milliliter
    'пак',   // packet
    'банка', // jar/can
    // Add more as needed
]; 