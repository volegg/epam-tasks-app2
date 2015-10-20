module.exports = [
    {
        pattern: '/form',
        methods: ['GET'],
        action: 'form::getAction'
    },
    {
        pattern: '/items',
        methods: ['POST'],
        action: 'items::postAction'
    },
    {
        pattern: '/items',
        methods: ['DELETE'],
        action: 'items::deleteAllAction'
    },
    {
        pattern: '/items',
        methods: ['GET'],
        action: 'items::getAction'
    },
    {
        pattern: '/index',
        methods: ['GET'],
        action: 'index::getAction'
    },
    {
        pattern: '/default',
        methods: ['GET'],
        action: 'default::getAction'
    }
];
