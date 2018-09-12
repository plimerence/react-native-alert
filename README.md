# react-native-alert
js实现的alert 支持基本样式定义  按钮点击的回调  安卓ios通用  使用方式方便   拒绝state引发的重绘render

## Demo
<a href="https://github.com/plimerence/react-native-alert/blob/master/pic/Snip20180912_10.png"><img src="https://github.com/plimerence/react-native-alert/blob/master/pic/Snip20180912_10.png" width="315"></a>

## Basic usage

```javascript
      ToastConfig = {
            cancel: () => {
                CustomToast.hide(this.toast);
            },
            ok :() =>{
                CustomToast.hide(this.toast);
            },
            content: 'eos to the galaxy',
            okConfig : {
                title:'确定',
                textStyle:{
                    color:'#2B63C9',
                }
            },
            cancelConfig :{
                title:'取消',
                textStyle:{
                    color:'#9FA5AF',
                }
            }
        }
        CustomToast.show(ToastConfig)
```

**MIT Licensed**
