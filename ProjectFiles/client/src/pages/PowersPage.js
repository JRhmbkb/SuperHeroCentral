import React from 'react';
import pow2 from './pow2.jpg';
import { Form, FormInput, FormGroup, Button,  Card, CardBody, CardTitle, Progress } from "shards-react";
import {
    Table,
    Image,
    Select,
    Row,
    Col,
    Spin
} from 'antd'
import MenuBar from '../components/MenuBar';
import { getPowerHeroes } from '../fetcher'
const { ColumnGroup, Column } = Table;
const { Option } = Select;

class PowersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            heroResults: [],
            publisherSelection: 'Marvel',
            powerSelection: 'Shapeshifting',
            powerResults:[],
            powerHeroNameSearch: '',
            totalScore: 0, 
            
        }

        this.onSearchClick = this.onSearchClick.bind(this)
        this.onPublisherSelect = this.onPublisherSelect.bind(this)
        this.onPowerSelect = this.onPowerSelect.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    onSearchClick() {
      this.setState({isLoading: true})
        getPowerHeroes(this.state.publisherSelection, this.state.powerSelection).then(res => {
            this.setState({ heroResults: res })
        }).then(() => {
          this.setState({isLoading: false})
        })
    }

    onPublisherSelect(value) {
        this.setState({ publisherSelection: value})
    }
    onPowerSelect(value) {
        this.setState({ powerSelection: value})
    }


    componentDidMount() {
        this.onSearchClick()
      
    }

    heroColumns = [
        {
          title: 'Hero Name',
          dataIndex: 'power_hero_name',
          key: 'power_hero_name',
          sorter: (a, b) => a.name.localeCompare(b.name),
        //   render: (text, row) => <Button onClick={(event) => this.getRecommendationsByHero(row)}>{text}</Button>
        },
       
      ];
    render() {

        console.log('state of hero results: ', this.state.heroResults)

        return (

            <div>

                <MenuBar />
                
                <div style={{ padding: "20px", }} >
                        <h1><Image width={125} height={100} src = {pow2}/> Heroes By Power </h1>
                      
                    </div>      
                      
                    <Form style={{ width: '80vw', margin: '0 auto', marginTop: '10px' }}>
                        <Row>
                            <Col flex={2}>
                            <FormGroup>
                                  <div>

                                    <label>Select a publisher.</label>

                                  </div>

                                    <Select defaultValue="Marvel" style={{ width: 120 }} onChange={this.onPublisherSelect}>
                                        <Option value="Marvel">Marvel</Option>
                                        <Option value="DC">DC</Option>
                                    </Select>

                                </FormGroup>

                               

                            </Col>
                            <Col flex={2}>
                            <FormGroup>
                                  <div>

                                    <label>Select a power.</label>

                                  </div>
                                 
                                    <Select defaultValue="Shapeshifting" style={{ width: 120 }} onChange={this.onPowerSelect}>
                                        <Option value="Agility">Agility</Option>
                                        {/* TASK 3: Take a look at Dataset Information.md from MS1 and add other options to the selector here  */}
                                        <Option value="Accelerated_Healing">Accelerated Healing</Option>
                                        <Option value="Clairvoyance">Clairvoyance</Option>
                                        <Option value="Danger_Sense">Danger Sense</Option>
                                        <Option value="Dimensional_Awareness">Dimensional Awareness</Option>
                                        <Option value="Dimensional_Travel">Dimensional Travel</Option>
                                        <Option value="Elasticity">Elasticity</Option>
                                        <Option value="Energy_Absorption">Energy Absorption</Option>
                                        <Option value="Energy_Beams">Energy Beams</Option>
                                        <Option value="Energy_Blasts">Energy Blasts</Option>

                                        <Option value="Flight">Flight</Option>
                                        <Option value="Illusions">Illusions</Option>
                                        <Option value="Immortality">Immortality</Option>
                                        <Option value="Intelligence">Intelligence</Option>
                                        <Option value="Invisibility">Invisibility</Option>
                                        <Option value="Invulnerability">Invulnerability</Option>
                                        <Option value="Levitation">Levitation</Option>
                                        <Option value="Longevity">Longevity</Option>
                                        <Option value="Magic">Magic</Option>
                                        <Option value="Mind_Control">Mind Control</Option>

                                        {/* <Option value="Omniscient">Omniscient</Option> */}
                                        <Option value="Power_Suit">Power Suit</Option>
                                        <Option value="Shapeshifting">Shapeshifting</Option>
                                        <Option value="Stamina">Stamina</Option>
                                        <Option value="Super_Speed">Super Speed</Option>
                                        <Option value="Super_Strength">Super Strength</Option>
                                        <Option value="Telepathy">Telepathy</Option>
                                        <Option value="Teleportation">Teleportation</Option>
                                        <Option value="Time_Travel">Time_Travel</Option>
                                        <Option value="Vision_Xray">Xray-Vision</Option>
                                    </Select>    

                                </FormGroup>
                                
                            </Col>

                         
                            <Col flex={2}>
                            <Button style={{ marginTop: '10px', marginBottom: '20px' }} onClick={() => this.onSearchClick()
                                            }>Search Heroes</Button>
                               </Col>

                        </Row>                     
                        
                    </Form>
                   
                    <Row justify='between' style={{ justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px'}}>
                    {/* <Image
                        width={200}
                        src = {pow2}
                    />  */}
                    <div style={{ paddingTop: '10px', marginTop: '10px', width: '50%', margin: '0 auto'}} >
                
                {
                  this.state.heroResults.length > 0 &&    <h3>{this.state.publisherSelection} Heroes with {this.state.powerSelection}:</h3>

                }

                {
                  this.state.isLoading ? 
                    <div justify="center" align="center" width="100vh" height="100vh" style={{ margin: '0 auto', paddingTop: '10px'}}>
                      <Spin size="large" style={{ margin: '0 auto'}} />
                    </div>
                  :
                  <div>
                    <Table width="100%"  dataSource={this.state.heroResults} columns={this.heroColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                  </div>
                }
             
              </div>
              </Row>

            
            </div>
        )
    }
}

export default PowersPage

