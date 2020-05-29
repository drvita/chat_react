import React, {Component} from 'react';
import Videos from './componentes/videos'
//const WebSocket = require('ws');

const url = "ws://35.223.29.62:8000";
const ws = new WebSocket(url);

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			msg: '',
			data: '',
			color: 'text-primary',
			url: 'https://www.youtube.com/embed/',
			video: 'F5n1h7ul9Mg',
			username: 'usuario'
		}
		this.onChangeInputs = this.onChangeInputs.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.sendVideo = this.sendVideo.bind(this);
		this.chat = React.createRef();
	}

	componentDidMount(){
		ws.onopen = event => {
			console.log('Coneccion al servidor WS con exito');
		};
		ws.onmessage = event => {
			let msgServer = JSON.parse(event.data);
			console.log('Tipo de mensaje entrante:', msgServer.type);
			if(msgServer.type=='message'){
				console.log('LLego un mensaje')
				let msg = "["+msgServer.id+"] "+ msgServer.text;
				let data;
				let color = (msgServer.id == 'SERVER') ? "text-warning" : this.state.color;
				if(this.state.data == "") data = <span className={color}> {msg} </span>;
				else data = <React.Fragment>{this.state.data}<br/><span className={color}>{msg}</span></React.Fragment>;
				this.setState({
					data
				});
			} else if(msgServer.type=='video') {
				console.log('LLego un video');
				this.setState({
					video: msgServer.text
				});
			}
			this.chat.current.scrollTop = this.chat.current.scrollHeight;
		};
		
		window.addEventListener("beforeunload", () => {
			const msg = {
				type: "message",
				text: 'El usuario cerro la ventana',
				id: this.state.username,
				date: Date.now()
			};
			ws.send(JSON.stringify(msg));
			ws.close();
		});
	}

	onChangeInputs(e){
		const {name, value} = e.target; 
        this.setState({
            [name]: value
		});
	}
	sendMsg(e){
		e.preventDefault();
		let msgText = this.state.msg;
		if(msgText != ""){
			let user = /^\/username/ig;
			let video = /^\/video/ig;
			let type = "message";
			let patron = user.test(msgText);
			if(!patron) patron =  video.test(msgText);

			if(patron){
				let char = msgText.split(' ');
				type = char[0].replace("/","");
				msgText = char[1];
			}

			const msg = {
				type: type,
				text: msgText,
				id: this.state.username,
				date: Date.now()
			};
			ws.send(JSON.stringify(msg));
			this.setState({
				msg:''
			});
		}
	}
	sendVideo(e){
		e.preventDefault();
		let video = this.state.video;
		console.log('Enviando video:',video);
		if(video != ""){
			
			const msg = {
				type: 'video',
				text: video,
				id: this.state.username,
				date: Date.now()
			};
			ws.send(JSON.stringify(msg));
			this.setState({
				msg:''
			});
		}
		console.log('Enviando video...');
	}

	render(){

		const textarea = {
			
    		border: '1px solid gray',
    		font: 'medium -moz-fixed',
    		height: '280px',
    		overflow:'auto',
    		padding: '2px',
			resize: 'both'
		}

		return (
			<div className="container">
				<div className="row mt-4">

					<div className="col-lg-5 col-mt-8">
						<div className="card">
							<div className="card-body bg-light">

								<form onSubmit={this.sendMsg}>
									<div className="form-group">
										<div className="form-control" 
											style={textarea}
											ref={this.chat} >
											{this.state.data}
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="msg" className="text-primary">Mensaje</label>
										<input type="text" name="msg" id="msg" 
											className="form-control"
											value={this.state.msg}
											onChange={this.onChangeInputs} />
									</div>
									<div className="form-group">
										<label htmlFor="color" className="text-primary">Color</label>
										<select name="color" id="color" 
											value={this.state.color} 
											onChange={this.onChangeInputs}
											className="form-control" >
											<option value="text-primary">Principal</option>
											<option value="text-secondary">Secundario</option>
											<option value="text-danger">Peligro</option>
											<option value="text-info">Informativo</option>
											<option value="text-dark bg-secondary">Dark</option>
										</select>
									</div>
									<div className="form-group">
										<button type="submit" className="btn btn-primary btn-block">Enviar mensaje</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="col">
						<Videos url={this.state.url} video={this.state.video} />
					</div>

				</div>
			</div>
		);
	}
}

export default App;