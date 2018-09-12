import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    ViewPropTypes,
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Easing,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    Modal
} from 'react-native';
const TOAST_MAX_WIDTH = 0.8;
const TOAST_ANIMATION_DURATION = 200;

const positions = {
    TOP: 20,
    BOTTOM: -20,
    CENTER: 0
};

const durations = {
    LONG: 3500,
    SHORT: 2000
};

let styles = StyleSheet.create({
    containerStyle: {
        borderRadius: 5
    },
    shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 10
    },
    textStyle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    },
    contain:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    footer:{
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: "#CED0CE"
    },
    modalViewStyle:{
        flex:1,
        // position:"absolute",
        // top:200,
        // left:0,
        // right:0,
        // bottom:0,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',

    },
    hudViewStyle: {
        width:250,
        maxHeight:300,
        backgroundColor:'red',
        justifyContent:'space-between',
        borderRadius:10
    },
    ModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

class ToastContainer extends Component {
    static displayName = 'ToastContainer';

    static propTypes = {
        ...ViewPropTypes,
        containerStyle: ViewPropTypes.style,
        duration: PropTypes.number,
        visible: PropTypes.bool,
        position: PropTypes.number,
        animation: PropTypes.bool,
        shadow: PropTypes.bool,
        backgroundColor: PropTypes.string,
        opacity: PropTypes.number,
        shadowColor: PropTypes.string,
        textColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        delay: PropTypes.number,
        hideOnPress: PropTypes.bool,
        onHide: PropTypes.func,
        onHidden: PropTypes.func,
        onShow: PropTypes.func,
        onShown: PropTypes.func
    };

    static defaultProps = {
        visible: false,
        duration: durations.SHORT,
        animation: true,
        shadow: true,
        position: positions.BOTTOM,
        opacity: 0.8,
        delay: 0,
        hideOnPress: true
    };

    constructor() {
        super(...arguments);
        const window = Dimensions.get('window');
        this.state = {
            visible: this.props.visible,
            opacity: new Animated.Value(0),
            windowWidth: window.width,
            windowHeight: window.height,
            keyboardScreenY: window.height
        };
    }

    componentWillMount() {
        Dimensions.addEventListener('change', this._windowChanged);
        Keyboard.addListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame);
    }

    componentDidMount = () => {
        if (this.state.visible) {
            this._showTimeout = setTimeout(() => this._show(), this.props.delay);
        }
    };

    componentWillReceiveProps = nextProps => {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                clearTimeout(this._showTimeout);
                clearTimeout(this._hideTimeout);
                this._showTimeout = setTimeout(() => this._show(), this.props.delay);
            } else {
                this._hide();
            }

            this.setState({
                visible: nextProps.visible
            });
        }
    };

    componentWillUpdate() {
        const { windowHeight, keyboardScreenY } = this.state;
        this._keyboardHeight = Math.max(windowHeight - keyboardScreenY, 0);
    }

    componentWillUnmount = () => {
        Dimensions.removeEventListener('change', this._windowChanged);
        Keyboard.removeListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame);
        this._hide();
    };

    _animating = false;
    _root = null;
    _hideTimeout = null;
    _showTimeout = null;
    _keyboardHeight = 0;

    _windowChanged = ({ window }) => {
        this.setState({
            windowWidth: window.width,
            windowHeight: window.height
        })
    };

    _keyboardDidChangeFrame = ({ endCoordinates }) => {
        this.setState({
            keyboardScreenY: endCoordinates.screenY
        })
    };

    _show = () => {
        clearTimeout(this._showTimeout);
        if (!this._animating) {
            clearTimeout(this._hideTimeout);
            this._animating = true;
            this.props.onShow && this.props.onShow(this.props.siblingManager);
            Animated.timing(this.state.opacity, {
                toValue: this.props.opacity,
                duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
                easing: Easing.out(Easing.ease)
            }).start(({finished}) => {
                if (finished) {
                    this._animating = !finished;
                    this.props.onShown && this.props.onShown(this.props.siblingManager);
                    if (this.props.duration > 0) {
                       // this._hideTimeout = setTimeout(() => this._hide(), this.props.duration);
                    }
                }
            });
        }
    };

    _hide = () => {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (!this._animating) {
          //  this.props.onHide && this.props.onHide(this.props.siblingManager);
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
                easing: Easing.in(Easing.ease)
            }).start(({finished}) => {
                if (finished) {
                    this._animating = false;
                    //this.props.onHidden && this.props.onHidden(this.props.siblingManager);
                }
            });
        }
    };
    renderContent = () =>{
        return <View style={{backgroundColor: 'white', width: 300, height: 140}}>
            <View style={{width: 300, height: 90}} showsVerticalScrollIndicator={false}>
                <Text style={{
                    fontSize: 16,
                    fontFamily: 'PingFangSC-Medium',
                    color: '#333B48',
                    textAlign: 'center',
                    marginTop: 22,
                    paddingHorizontal: 32
                }}>{this.props.content && this.props.content}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.props.cancel()
                }}>
                    <View style={{
                        borderTopWidth: 1,
                        borderColor: '#eeeeee',
                        height: 50,
                        width: 150,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={[{fontSize: 18, textAlign: 'center'},{...this.props.cancelConfig.textStyle}]}>{this.props.cancelConfig && this.props.cancelConfig.title && this.props.cancelConfig.title}</Text>
                    </View></TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.props.ok()
                }}><View style={{
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    height: 50,
                    width: 150,
                    borderColor: '#eeeeee',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={[{fontSize: 18, textAlign: 'center'},{...this.props.okConfig.textStyle}]}>{this.props.okConfig && this.props.okConfig.title && this.props.okConfig.title}</Text>
                </View></TouchableOpacity></View>
        </View>
    }

    render() {
        return (this.state.visible || this._animating) ? <Modal
            animationType='none'// 进场动画 fade
            onRequestClose={this.ModalClose}
            visible={true}// 是否可见
            transparent={true}
        >
         <View style={styles.ModalContainer}>
         {this.renderContent()}
         </View>
        </Modal> : null;
    }
}

export default ToastContainer;
export {
    positions,
    durations
}















