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
      pattern: '/script',
      methods: ['GET'],
      action: 'script::getAction'
    },
    {
      pattern: '/styles',
      methods: ['GET'],
      action: 'styles::getAction'
    }
];
