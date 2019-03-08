$(function(){
    barCharts();
    pieCharts();
});
var barCharts = function () {
    // 获取数据
    var data = [
        {
            name:'一月',
            value:300
        },
        {
            name:'二月',
            value:400
        },
        {
            name:'三月',
            value:500
        },
        {
            name:'四月',
            value:200
        },
        {
            name:'五月',
            value:600
        },
        {
            name:'六月',
            value:300
        }
    ];
    var xdata = [], sdata = [];
    data.forEach(function (item,i) {
        xdata.push(item.name);
        sdata.push(item.value);
    });
    // 选择容器 初始化插件
    var myChart = echarts.init(document.getElementById('barCharts'));
    var option = {
        title: {
            text: '2018年注册人数',
            x:'center'
        },
        legend:{
            data: ['注册人数'],
            x: 'left'
        },
        tooltip: {

        },
        xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        }],
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '注册人数',
            data: [120, 200, 150, 80, 70, 110],
            type: 'bar'
        }]
    };
    option.xAxis[0].data = xdata;
    option.series[0].data = sdata;
    myChart.setOption(option);
};
var pieCharts = function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('pieCharts'));

    // 指定图表的配置项和数据
    option = {
        title : {
            text: '品牌销售占比',
            subtext: '2019年2月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            /*
            * series.name  a
            * data.name  b
            * data.value  c
            * 占比  d
            * */
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['李宁','耐克','阿迪','匡威','回力']
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'李宁'},
                    {value:310, name:'耐克'},
                    {value:234, name:'阿迪'},
                    {value:135, name:'匡威'},
                    {value:1548, name:'回力'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
};