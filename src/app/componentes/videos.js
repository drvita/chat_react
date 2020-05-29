import React, {Component} from 'react';

class Videos extends Component {
    constructor(props){
        super(props)
        this.state = {
            url: '',
            video: ''
        }
    }

    render(){

        return <div className="jumbotron">
            <div className="embed-responsive embed-responsive-16by9">
                <iframe src={this.props.url+this.props.video} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <br/>
            {this.props.video}
        </div>
    }
}

export default Videos;