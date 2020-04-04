import React, { Component } from 'react';
import { View, Spinner } from 'native-base';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: "column", alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>
                <Spinner color='blue' />
            </View>
        );
    }
}

export default Loading;