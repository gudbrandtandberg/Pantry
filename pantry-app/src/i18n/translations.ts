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
        customValue: string;
        syncStatus: {
            synced: string;
            syncing: string;
            error: string;
        };
        deletePantryTitle: string;
        deletePantryConfirm: string;
        deletePantryPlaceholder: string;
        deleting: string;
        share: string;
        sharePantryTitle: string;
        currentMembers: string;
        createInviteLink: string;
        creatingLink: string;
        inviteLinkCreated: string;
        copy: string;
        close: string;
        onlyOwnerCanShare: string;
        loginToJoin: string;
        joiningPantry: string;
        backToHome: string;
        invalidInviteLink: string;
        inviteLinkExpired: string;
        alreadyMember: string;
        signup: {
            title: string;
            email: string;
            password: string;
            submit: string;
            loading: string;
            error: string;
            haveAccount: string;
            login: string;
        };
        members: string;
        owner: string;
        editor: string;
        loading: string;
        inviteFriends: string;
        generateInviteLink: string;
        generating: string;
        invalidInviteCode: string;
        signupWithInvite: string;
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
        moveToInStock: 'Flytt til lager',
        customValue: 'Skriv egen verdi...',
        syncStatus: {
            synced: 'Synkronisert',
            syncing: 'Synkroniserer...',
            error: 'Synkroniseringsfeil'
        },
        deletePantryTitle: 'Slett matskap',
        deletePantryConfirm: 'Er du sikker på at du vil slette "{name}"? Dette kan ikke angres. Skriv inn navnet på matskapet for å bekrefte.',
        deletePantryPlaceholder: 'Skriv matskap navn her',
        deleting: 'Sletter...',
        share: 'Del',
        sharePantryTitle: 'Del matskap',
        currentMembers: 'Nåværende medlemmer',
        createInviteLink: 'Lag invitasjonslenke',
        creatingLink: 'Lager lenke...',
        inviteLinkCreated: 'Del denne lenken med vennene dine:',
        copy: 'Kopier',
        close: 'Lukk',
        onlyOwnerCanShare: 'Bare eiere kan dele matskapet',
        loginToJoin: 'Logg inn for å bli med i matskapet',
        joiningPantry: 'Blir med i matskap...',
        backToHome: 'Tilbake til forsiden',
        invalidInviteLink: 'Ugyldig invitasjonslenke',
        inviteLinkExpired: 'Invitasjonslenken har utløpt',
        alreadyMember: 'Du er allerede medlem av dette matskapet',
        signup: {
            title: 'Opprett konto',
            email: 'E-post',
            password: 'Passord',
            submit: 'Opprett konto',
            loading: 'Laster...',
            error: 'Kunne ikke opprette konto',
            haveAccount: 'Har du allerede en konto?',
            login: 'Logg inn'
        },
        members: 'Medlemmer',
        owner: 'Eier',
        editor: 'Redaktør',
        loading: 'Laster...',
        inviteFriends: 'Inviter venner',
        generateInviteLink: 'Generer invitasjonslenke',
        generating: 'Genererer...',
        invalidInviteCode: 'Ugyldig invitasjonskode',
        signupWithInvite: 'Registrer deg med invitasjon',
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
        moveToInStock: 'Move to stock',
        customValue: 'Enter custom value...',
        syncStatus: {
            synced: 'Synced',
            syncing: 'Syncing...',
            error: 'Sync error'
        },
        deletePantryTitle: 'Delete Pantry',
        deletePantryConfirm: 'Are you sure you want to delete "{name}"? This cannot be undone. Type the pantry name to confirm.',
        deletePantryPlaceholder: 'Type pantry name here',
        deleting: 'Deleting...',
        share: 'Share',
        sharePantryTitle: 'Share Pantry',
        currentMembers: 'Current Members',
        createInviteLink: 'Create Invite Link',
        creatingLink: 'Creating link...',
        inviteLinkCreated: 'Invite link created! Share this with others:',
        copy: 'Copy',
        close: 'Close',
        onlyOwnerCanShare: 'Only owners can share the pantry',
        loginToJoin: 'Please log in to join the pantry',
        joiningPantry: 'Joining pantry...',
        backToHome: 'Back to home',
        invalidInviteLink: 'Invalid invite link',
        inviteLinkExpired: 'This invite link has expired',
        alreadyMember: 'You are already a member of this pantry',
        signup: {
            title: 'Create Account',
            email: 'Email',
            password: 'Password',
            submit: 'Sign Up',
            loading: 'Creating account...',
            error: 'Could not create account',
            haveAccount: 'Already have an account?',
            login: 'Sign In'
        },
        members: 'Members',
        owner: 'Owner',
        editor: 'Editor',
        loading: 'Loading...',
        inviteFriends: 'Invite Friends',
        generateInviteLink: 'Generate Invite Link',
        generating: 'Generating...',
        invalidInviteCode: 'Invalid invite code',
        signupWithInvite: 'Sign up with invite',
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
        moveToInStock: 'Переместить в наличие',
        customValue: 'Ввести своё значение...',
        syncStatus: {
            synced: 'Синхронизировано',
            syncing: 'Синхронизация...',
            error: 'Ошибка синхронизации'
        },
        deletePantryTitle: 'Удалить кладовую',
        deletePantryConfirm: 'Вы уверены, что хотите удалить "{name}"? Это действие нельзя отменить. Введите название кладовой для подтверждения.',
        deletePantryPlaceholder: 'Введите название кладовой',
        deleting: 'Удаление...',
        share: 'Поделиться',
        sharePantryTitle: 'Поделиться кладовой',
        currentMembers: 'Текущие участники',
        createInviteLink: 'Создать ссылку-приглашение',
        creatingLink: 'Создание ссылки...',
        inviteLinkCreated: 'Поделитесь этой ссылкой с друзьями:',
        copy: 'Копировать',
        close: 'Закрыть',
        onlyOwnerCanShare: 'Только владельцы могут делиться кладовой',
        loginToJoin: 'Войдите, чтобы присоединиться к кладовой',
        joiningPantry: 'Присоединение к кладовой...',
        backToHome: 'Вернуться на главную',
        invalidInviteLink: 'Недействительная ссылка приглашения',
        inviteLinkExpired: 'Срок действия ссылки истек',
        alreadyMember: 'Вы уже являетесь участником этой кладовой',
        signup: {
            title: 'Создать аккаунт',
            email: 'Эл. почта',
            password: 'Пароль',
            submit: 'Создать аккаунт',
            loading: 'Создание аккаунта...',
            error: 'Не удалось создать аккаунт',
            haveAccount: 'Уже есть аккаунт?',
            login: 'Войти'
        },
        members: 'Участники',
        owner: 'Владелец',
        editor: 'Редактор',
        loading: 'Загрузка...',
        inviteFriends: 'Пригласить друзей',
        generateInviteLink: 'Создать пригласительную ссылку',
        generating: 'Создание...',
        invalidInviteCode: 'Неверный код приглашения',
        signupWithInvite: 'Регистрация по приглашению',
    }
};

export const units = {
    'no': ['stk', 'kg', 'g', 'l', 'dl', 'pk', 'boks', 'pose'],
    'en': ['pcs', 'kg', 'g', 'l', 'ml', 'pkg', 'can', 'bag'],
    'ru': ['шт', 'кг', 'г', 'л', 'мл', 'уп', 'банка', 'пакет']
};

export const locations = {
    'no': ['Hjemme', 'Hytta i Fjellet', 'Hytta ved Sjøen'],
    'en': ['Home', 'Mountain Cabin', 'Beach House'],
    'ru': ['Дом', 'Горная Хижина', 'Дом у Моря']
}; 