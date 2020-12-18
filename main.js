var seen = new Vue({
    el: '#seen',
    data: {
        isSeen: true
    },
    methods: {
        setSeen: function(){
            if(this.isSeen) isSeen = false
            else isSeen = true
        }
    }
})