# react-native-alert
js实现的alert 支持基本样式定义  按钮点击的回调  安卓ios通用  使用方式方便   拒绝state引发的重绘render

## Demo
<a href="https://raw.githubusercontent.com/brentvatne/react-native-scrollable-tab-view/master/demo_images/demo.gif"><img src="https://raw.githubusercontent.com/brentvatne/react-native-scrollable-tab-view/master/demo_images/demo.gif" width="350"></a>

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
