import React from 'react';
import { Form, FormInput, FormGroup, Button,  Card, CardBody } from "shards-react";
import {
    Select,
    Row,
    Col,
} from 'antd'
import MenuBar from '../components/MenuBar';
import { getHeroScore, getAllHeroes, getPowerList } from '../fetcher'
const { Option } = Select;

class VersusPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            heroNameSelection1: '',
            heroNameSelection2: '',
            scoreResults1:[],
            scoreResults2:[],
            alignResults1: [],
            alignResults2: [],
            powerResults1: [],
            powerResults2: [],
            unableToFetch: false
        }

        this.onSearchClick = this.onSearchClick.bind(this)
        this.onHeroNameSelect1 = this.onHeroNameSelect1.bind(this)
        this.onHeroNameSelect2 = this.onHeroNameSelect2.bind(this)
        this.resetState = this.resetState.bind(this)

    }

    resetState() {
        this.setState({
            heroNameSelection1: '',
            heroNameSelection2: '',
            scoreResults1:[],
            scoreResults2:[],
            alignResults1: [],
            alignResults2: [],
            powerResults1: [],
            powerResults2: [],
        })
    }

    onSearchClick() {

        this.setState({unableToFetch: false})

        // only run this if they typed something in for hero 1
        if (this.state.heroNameSelection1?.length > 0) {
            getHeroScore(this.state.heroNameSelection1).then(res => {

                // only update state if we have a result
                if (res.results[0]) {
                    this.setState({ scoreResults1: res.results[0] })
                } else {
                    this.setState({unableToFetch: true})
                    this.resetState()
                }
    
            })
        } else {
            this.setState({unableToFetch: true})
            this.resetState()
        }

        if (this.state.heroNameSelection2?.length > 0) {
            getHeroScore(this.state.heroNameSelection2).then(res => {
                if (res.results[0]) {
                    this.setState({ scoreResults2: res.results[0] })
                } else {
                    this.setState({unableToFetch: true})
                    this.resetState()
                }
            })
        } else {
            this.setState({unableToFetch: true})
            this.resetState()
        }


        if (this.state.heroNameSelection1?.length > 0) {
            getAllHeroes(this.state.heroNameSelection1)
            .then(res => {
              this.setState({ alignResults1: res.results[0] })
            })
        } else {
            this.setState({unableToFetch: true})
            this.resetState()
        }

        if (this.state.heroNameSelection2?.length > 0) {
            getAllHeroes(this.state.heroNameSelection2)
            .then(res => {

                if (res.results[0]) {
                    this.setState({ alignResults2: res.results[0] })
                } else {
                    this.setState({unableToFetch: true})
                    this.resetState()
                }
            })
        } else {
            this.setState({unableToFetch: true})
            this.resetState()
        }


        if (this.state.heroNameSelection1?.length > 0) {
            getPowerList(this.state.heroNameSelection1)
            .then(res => {
            
                if (res.results) {
                    let list = []

                    res.results.forEach(r=>{
                        if (r.power_hero_name === this.state.scoreResults1.power_hero_name) {
                            list.push(r.Power)
                        }
                    })

                    this.setState({ powerResults1: list })
                } else {
                    this.setState({unableToFetch: true})
                }
             })
        } else {
            this.setState({unableToFetch: true})
        }


        if (this.state.heroNameSelection2?.length > 0) {
            getPowerList(this.state.heroNameSelection2)
            .then(res => {
                if (res.results) {
                    let list = []

                    res.results.forEach(r=>{
                        if (r.power_hero_name === this.state.scoreResults2.power_hero_name) {
                            list.push(r.Power)
                        }
                    })

                    this.setState({ powerResults2: list })
                } else {
                    this.setState({unableToFetch: true})
                }
             })
        } else {
            this.setState({unableToFetch: true})
        }
    }
  
    onHeroNameSelect1(event) {
        this.setState({ heroNameSelection1: event.target.value})
    }
    onHeroNameSelect2(event) {
        this.setState({ heroNameSelection2: event.target.value})
    }


    heroColumns = [
        {
          title: 'Hero Name',
          dataIndex: 'power_hero_name',
          key: 'power_hero_name',
          sorter: (a, b) => a.name.localeCompare(b.name),
        //   render: (text, row) => <Button onClick={(event) => this.getRecommendationsByHero(row)}>{text}</Button>
        },
        {
          title: 'Score',
          dataIndex: 'total_score',
          key: 'total_score',
          sorter: (a, b) => a.alignment.localeCompare(b.alignment)
        },
   
      ];
    render() {
     
        // console.log('state of score results: ', this.state.scoreResults1)
        console.log('state of power results: ', this.state.powerResults1)

        return (

            <div>

                <MenuBar />
                <div style={{ padding: "30px", }} >
                        <h1>Who's the Most Powerful Superhero?</h1>
                    </div>    
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                <Row>
                    <Col flex={2}>
                      <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <h1 style={{ paddingBottom: '10px'}}>
                          
                          <span style={{ color: 'red'}}>Hero 1</span>
                        
                        </h1>
                        <label>Search for Hero 1 (e.g. 'Batman')</label>
                        <FormInput placeholder="Hero Name" value={this.state.heroNameSelection1} onChange={this.onHeroNameSelect1} />
                      </FormGroup>
                    </Col>
                    <Col flex={2}>
                      <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                        <h1 style={{ paddingBottom: '10px'}}>
                        <span style={{ color: '#007BFF'}}>Hero 2</span>
                        </h1>
                        <label>Search for Hero 2 (e.g. 'Hulk')</label>
                        <FormInput placeholder="Hero Name" value={this.state.heroNameSelection2} onChange={this.onHeroNameSelect2} />
                      </FormGroup>
                    </Col>
                </Row>
           
               
                <br></br>

                       
                    <Row >

                        <Col flex={2}>
                       
                          <FormGroup style={{ width: '20vw', margin: '0 auto', marginBottom: '10px' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.onSearchClick}>Show me the match up!</Button>
                          </FormGroup>
                        </Col>

                    </Row>

                    </Form>

                    {
                        this.state.unableToFetch ?

                        <Row gutter='30' align='middle' justify='center' style={{ paddingTop: '20px'}}>
                            Oh no, unable to fetch! Please try your hero search again.
                        </Row>

                        :

                    <div>

                        <Row gutter='30' align='middle' justify='center'>
                                    <Col span={9} style={{ textAlign: 'center',  }}>
                                        { this.state.scoreResults1.total_score > this.state.scoreResults2.total_score && <h3>{`${this.state.scoreResults1.power_hero_name} wins!`}</h3>}
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                    </Col >
                                    {/* <Col span={6} style={{ textAlign: 'center',  }}>
                                        { this.state.scoreResults1.total_score == this.state.scoreResults2.total_score && <h3>{`${this.state.scoreResults1.power_hero_name} and ${this.state.scoreResults2.power_hero_name} are equally matched!`}</h3>}
                                    </Col> */}
                                    <Col span={9} style={{ textAlign: 'center',  }}>
                                        { this.state.scoreResults2.total_score > this.state.scoreResults1.total_score && <h3>{`${this.state.scoreResults2.power_hero_name} wins!`}</h3>}
                                    </Col>
                                    
                                </Row>
                    
                        <Card>
                            <CardBody>
                                
                            
                                <Row gutter='30' align='middle' justify='center'>
                                    <Col span={9} style={{ textAlign: 'left', backgroundColor: (this.state.scoreResults1.power_hero_name && (this.state.scoreResults1.total_score > this.state.scoreResults2.total_score) ) ? 'red' : 'white' }}>
                                    <h3 style={{ color: this.state.scoreResults1.total_score <= this.state.scoreResults2.total_score ? 'black' : 'white'}}>{this.state.scoreResults1.power_hero_name}</h3> 
                                    

                                    </Col>
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '22px'}}>VERSUS</span>
                                    </Col >
                                    <Col span={9} style={{ textAlign: 'right', backgroundColor: (this.state.scoreResults2.power_hero_name && (this.state.scoreResults2.total_score > this.state.scoreResults1.total_score) ) ? '#007BFF' : 'white' }}>
                                    <h3 style={{ color: this.state.scoreResults2.total_score <= this.state.scoreResults1.total_score ? 'black' : 'white'}}>{this.state.scoreResults2.power_hero_name}</h3> 
                                    
                                    </Col>

                                </Row>
                                <Row gutter='30' align='middle' justify='center'>

                                    <Col span={9} style={{ textAlign: 'left' }}>
                                        <h3>{this.state.scoreResults1.total_score}</h3> 
                                    </Col >

                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        Power Score
                                    </Col >

                                    <Col span={9} style={{ textAlign: 'right' }}>
                                        <h3>{this.state.scoreResults2.total_score}</h3> 
                                    
                                    </Col>

                                </Row>

                                <Row gutter='30' align='middle' justify='center'>

                                    <Col span={9} style={{ textAlign: 'left' }}>
                                        <h5>{this.state.powerResults1?.length > 0 && this.state.powerResults1.join(', ') }</h5> 
                                    </Col >

                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        Powers
                                    </Col >

                                    <Col span={9} style={{ textAlign: 'right' }}>
                                        <h5>{this.state.powerResults2?.length > 0 && this.state.powerResults2.join(', ') }</h5> 

                                    </Col>

                                 </Row>
                                
                                <Row gutter='30' align='middle' justify='center'>

                                    <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.alignResults1.alignment}</h3> 
                                    </Col >

                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        Alignment
                                    </Col >

                                    <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.alignResults2.alignment}</h3> 
                                    </Col>

                                </Row>
                                    <Row gutter='30' align='middle' justify='center'>

                                    <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.alignResults1.Publisher}</h3> 
                                    </Col >
                                    <Col span={6} style={{ textAlign: 'center' }}>
                                        Publisher
                                    </Col >
                                    
                                    <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.alignResults2.Publisher}</h3> 
                                    </Col>
                                </Row>                   

                            </CardBody>
                        </Card>
                    </div>

                    }



            
            </div>
        )
    }
}

export default VersusPage

