var data = {
    errors: {
        count: 0,
        map: {},
        init: function () {
            'use strict';
            
            this.map.a = 0;
            this.map.b = 0;
            this.map.c = 0;
            this.map.d = 0;
            this.map.e = 0;
            this.map.f = 0;
            this.map.g = 0;
            this.map.h = 0;
            this.map.i = 0;
            this.map.j = 0;
            this.map.k = 0;
            this.map.l = 0;
            this.map.m = 0;
            this.map.n = 0;
            this.map.o = 0;
            this.map.p = 0;
            this.map.q = 0;
            this.map.r = 0;
            this.map.s = 0;
            this.map.t = 0;
            this.map.u = 0;
            this.map.v = 0;
            this.map.w = 0;
            this.map.x = 0;
            this.map.y = 0;
            this.map.z = 0;
        },
        add: function (key) {
            'use strict';
            if (this.map.hasOwnProperty(key)) {
                this.map[key] += 1;
            } else {
                this.map[key] = 1;
            }
            this.count += 1;
        },
        graphData: function () {
            'use strict';
            var arr = [['Key', 'Current', 'History']],
                key;

            for (key in this.map) {
                if (this.map.hasOwnProperty(key)) {
                    arr.push([key, this.map[key], 0]);
                }
            }

            return arr;
        }
    }
};

data.errors.init();
