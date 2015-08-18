module.exports = [
    {
        pattern: '/form',
        methods: ['GET'],
        action: 'form::getAction'
    },
    {
      pattern: '/css',
      methods: ['GET'],
      action: 'css::getAction'
    },
    {
      pattern: '/js',
      methods: ['GET'],
      action: 'js::getAction'
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
    }
];
