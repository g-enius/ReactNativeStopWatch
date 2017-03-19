/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} from 'react-native'

import FormatTime from 'minutes-seconds-milliseconds'

export default class ReactNativeStopWatch extends Component {
  //initializer
  constructor(props) {
    super(props);
    this.state = {
      timeElapsed: null,
      reset:true,
      running: false,
      startTime: null,
      laps: []
    }
  }

  render() {
    return (
      <View style = {styles.container}>
        <View style = {styles.header}>
          <View style = {styles.timerWrapper}>
            <Text style = {styles.timer}>
              {FormatTime(this.state.timeElapsed)}
            </Text>
          </View>
          <View style={[styles.buttonWrapper]}>
            {this.lapResetButton()}
            {this.startStopButton()}
         </View>
        </View>
        <ScrollView style = {styles.footer}>
          {this.laps()}
        </ScrollView>
      </View>
    );
  }

  startStopButton() {
    let style = this.state.running ? styles.stopButton : styles.startButton
    return (
      <TouchableHighlight
        underlayColor = 'gray'
        style = {[styles.button, style]}
        onPress = {this.handleStartPress.bind(this)}
        >
        <Text>
          {this.state.running ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
    );
  }

  lapResetButton() {
    let style = this.state.reset ? styles.disable : styles.lapButton
    return (
      <TouchableHighlight
      underlayColor = 'gray'
      style = {[styles.button, style]}
      onPress = {this.handleLapResetPress.bind(this)}
      >
      <Text>
        {this.state.running ? 'Lap' : 'Reset'}
      </Text>
      </TouchableHighlight>
    );
  }

  handleStartPress() {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({running: false});
      return;
    }

    this.setState({reset: false});
    this.setState({startTime: new Date()});

    this.interval = setInterval( () => {
      this.setState({
        timeElapsed:new Date() - this.state.startTime,
        running: true,
      });
    }, 30);
  }

  handleLapResetPress() {
    if (this.state.running) {
      let lap = this.state.timeElapsed
      this.setState({
        startTime: new Date(),
        laps:this.state.laps.concat([lap])
      });
    } else {
      this.setState({
        reset: true,
        running: false,
        timeElapsed:null,
        startTime: null,
        laps: []
      });
    }

  }

  laps() {
    if (this.state.reset) {
      return
    }

    let runningLap =
    <View key = {this.state.laps.length + 1} style = {styles.lap}>
      <Text style = {styles.lapText}>
        Lap #{this.state.laps.length + 1}
      </Text>
      <Text style = {styles.lapTime}>
        {FormatTime(this.state.timeElapsed)}
      </Text>
    </View>

    let staticLops = this.state.laps.map((time, index) => {
      return  <View key = {index} style = {styles.lap}>
        <Text style = {styles.lapText}>
          Lap #{index + 1}
        </Text>
        <Text style = {styles.lapTime}>
          {FormatTime(time)}
        </Text>
      </View>
    }).reverse()

    return [runningLap].concat(staticLops)
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  header: {
    flex: 1
  },
  footer:{
    flex: 1
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  timer: {
    fontSize: 60,
    width: 260 //to give a fixed width in case width changes while running
  },
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    borderColor: 'green',
  },
  stopButton: {
    borderColor: 'red',
  },
  lapButton:{
    borderColor:'blue',
  },
  disable:{
    borderColor:'gray',
  },
  lap: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  lapText:{
    flex:1,
    fontSize: 30,
    paddingLeft: 30
  },
  lapTime:{
    flex: 1,
    fontSize: 30,
    textAlign:'left',
    paddingLeft: 30
  }
});

AppRegistry.registerComponent('ReactNativeStopWatch', () => ReactNativeStopWatch);
