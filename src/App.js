import React, { Component } from 'react';
import './App.css';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip  } from 'recharts';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AutoComplete from 'material-ui/AutoComplete';
import col from 'react-bootstrap/lib/Col';


let Col = col;

const pokeData = require('./data/ja');
console.log(pokeData.indexOf("ルカリオ") +1);



// request recharts react-bootstrap material-ui

class App extends Component {
    constructor(props){
        super(props);
        this.state = {"name": "ポケモンの名前",
            "name_e":"英語名",
            "classification": null,
            "type": "ポケモンのタイプ",
            "image": "",
            "image_b":"",
            "weight": 0,
            "height": 0,
            "id":"図鑑番号",
            "H":0,
            "A":0,
            "B":0,
            "C":0,
            "D":0,
            "S":0,
            "data":null
        };

        this.data = {data:"test"};


        this.getPokemon = this.getPokemon.bind(this);
    }

    someeve(eve){
        this.data.data = eve;

    }

    setitem(){
        this.getPokemon(this.data.data)
    }

    getPokemon(pokename){
        let pokeType = [];
        if (pokeData.indexOf(pokename) === -1 ) {
            console.log(pokename);
            alert(pokename + "なんてポケモンいません！！！");
        }else{
            let num = (pokeData.indexOf(pokename) +1);
            console.log(pokename);

            fetch(`https://pokeapi.co/api/v2/pokemon/${num}/`)
                .then((response) => response.json())
                .then((json) => { //とってきたjsonのデータをstateに入れる
                    this.setState({weight:json.weight});
                    this.setState({height:json.height});
                    this.setState({id:json.id});
                    this.setState({name:pokename});
                    this.setState({name_e:json.name});
                    for (let i =0;i<json["types"].length;i++){
                        pokeType += " : " +json["types"][i].type.name;
                    }
                    this.setState({type:pokeType});
                    this.setState({S:json["stats"][0]["base_stat"]});
                    this.setState({A:json["stats"][4]["base_stat"]});
                    this.setState({B:json["stats"][3]["base_stat"]});
                    this.setState({C:json["stats"][2]["base_stat"]});
                    this.setState({D:json["stats"][1]["base_stat"]});
                    this.setState({H:json["stats"][5]["base_stat"]});

                    fetch(json["forms"][0].url)
                        .then((response2)=> response2.json())
                        .then((json2) => {
                            this.setState({image:json2["sprites"]["front_default"]});
                            this.setState({image_b:json2["sprites"]["back_default"]})
                        })

                } )
                .catch((response) => { //例外処理
                    alert("ポケモンの名前を入力してください！");
                })
        }
    };//クラスの終わり
    render() {
        return (
            <div className="reactElem">

                <Col xs={12} md={12}>
                    <div className="textArea">
                        <MuiThemeProvider>
                            <AutoComplete
                                hintText="コイキング"
                                dataSource={pokeData}
                                onUpdateInput={(input)=>{this.someeve(input)}}
                                onNewRequest={()=>{this.setitem()}}
                            />
                            <p>{this.state.data}</p>
                        </MuiThemeProvider>

                    </div>
                </Col>


                <div className="container">


                    <Col xs={12} md={6}>
                        <div className="index">
                            <h1>ポケモンずかん</h1>
                            <img src={this.state.image} className="image" />
                            <img src={this.state.image_b} className="image_b" />
                            <p>図鑑ナンバー => {this.state.id}</p>
                            <p>{this.state.name}</p>
                            <p>英語名: {this.state.name_e}</p>
                            <p>{this.state.type}</p>
                            <p>重さ:{this.state.weight},高さ:{this.state.height}</p>

                            <p>H:{this.state.H} A:{this.state.A} B:{this.state.B}</p>
                            <p>C:{this.state.C} D:{this.state.D} S:{this.state.S}</p>
                        </div>

                    </Col>


                    <Col xs={12} md={6}>
                        <div className="chart">



                            <RadarChart　id={"chart"}  outerRadius={70} width={300} height={300} data={
                                [
                                    { subject: 'HP', A: this.state.H , B: 110, fullMark: 150 },
                                    { subject: '攻撃', A: this.state.A, B: 130, fullMark: 150 },
                                    { subject: '防御', A: this.state.B, B: 130, fullMark: 150 },
                                    { subject: '素早さ', A: this.state.S, B: 100, fullMark: 150 },
                                    { subject: '特防', A: this.state.D, B: 90, fullMark: 150 },
                                    { subject: '特攻', A: this.state.C, B: 85, fullMark: 150 },]
                            }>
                                <PolarGrid />
                                <Tooltip />
                                <PolarAngleAxis dataKey="subject" />
                                <Radar name="Value" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                            </RadarChart>

                        </div>
                    </Col>

                </div>



            </div>
        );
    }
}

export default App;