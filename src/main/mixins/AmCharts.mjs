import Base from '../../core/Base.mjs';

/**
 * Helper class to include amCharts into your neo.mjs app
 * https://www.amcharts.com/docs/v4/
 * @class Neo.main.mixins.AmCharts
 * @extends Neo.core.Base
 * @singleton
 */
class AmCharts extends Base {
    static getConfig() {
        return {
            /**
             * @member {String} className='Neo.main.mixins.AmCharts'
             * @private
             */
            className: 'Neo.main.mixins.AmCharts'
        }
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.id
     * @param {String} data.path
     */
    changeChartConfig(data) {
        console.log('changeChartConfig', data);
        if (this.hasChart(data.id)) {
            console.log(this.charts[data.id].yAxes.values[0]);
            this.charts[data.id].xAxes.values[0].logarithmic = true;
            this.charts[data.id].validateNow();
            //this.charts[data.id].yAxes = data.data;
        }
    }

    /**
     *
     * @param {Object} data
     * @param {Object} data.config
     * @param {String} data.id
     * @param {String} data.type='XYChart'
     */
    createChart(data) {
        console.log('createChart', data);
        const me = this;

        me.charts = me.charts || {}; // todo: refactor this class into a singleton

        setTimeout(() => {
            me.charts[data.id] = am4core.createFromConfig(data.config, data.id, am4charts[data.type || 'XYChart']);
            console.log(me.charts[data.id]);
        }, 1000);
    }

    /**
     *
     * @param {String} id
     * @return {Boolean}
     */
    hasChart(id) {
        if (!this.charts[id]) {
            console.log('main.mixins.AmCharts no chart found for data.id:', id);
            return false;
        }

        return true;
    }

    /**
     * Async approach
     * core.js has to arrive first or the other scripts will cause JS errors since they rely on it
     * => fetching the other files after core.js is loaded
     */
    insertAmChartsScripts() {
        const me       = this,
              basePath = '//www.amcharts.com/lib/4/';

        me.loadScript(basePath + 'core.js').then(() => {
            Promise.all([
                me.loadScript(basePath + 'charts.js'),
                me.loadScript(basePath + 'maps.js')
            ]).then(() => {
                console.log('#####amCharts ready');
            });
        });
    }

    /**
     *
     * @param {Object} data
     * @param {Object} data.data
     * @param {String} data.id
     */
    updateChartData(data) {
        if (this.hasChart(data.id)) {
            this.charts[data.id].data = data.data;
        }
    }
}

Neo.applyClassConfig(AmCharts);

export {AmCharts as default};