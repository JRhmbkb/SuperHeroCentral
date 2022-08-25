import React from 'react';
import { Form, FormInput, FormGroup, Button, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from "shards-react";
import {
  Table,
   Select,
   Row,
   Col,
    Spin,
    Radio
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllHeroes, fetchRecommendationsByHero, fetchRecommendationsByPower } from '../fetcher'
const { Option } = Select;

class RecommendationsPage extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        heroesResults: [],
        keywordSearch: "",
        isLoading: true,
        isLoadingRecommendations: false,
        selectedHero: "",
        selectedPower: "agility",
        recommendationsModalOpen: false,
        recommendationsList: [],
        heroNameOrPower: 'heroName'
      }

      this.onChangeOfKeyword = this.onChangeOfKeyword.bind(this)
      this.updateSearchResults = this.updateSearchResults.bind(this)
      this.getRecommendationsByHero = this.getRecommendationsByHero.bind(this)
      this.getRecommendationsByPower = this.getRecommendationsByPower.bind(this)
      this.closeRecommendationsModal = this.closeRecommendationsModal.bind(this)
    }

    componentDidMount() {
      this.updateSearchResults()
    }

    onChangeOfKeyword(event) {
        this.setState({ keywordSearch: event.target.value })
    }

      updateSearchResults() {
        this.setState({isLoading: true})
        getAllHeroes(this.state.keywordSearch)
        .then(res => {
          this.setState({ heroesResults: res.results })
        })
        .then(() => {
          this.setState({isLoading: false})
        })
      }

    getRecommendationsByHero(hero) {
        // extra loading state var
        this.setState({isLoadingRecommendations: true})

        this.setState({recommendationsModalOpen: true})
        this.setState({selectedHero: hero})

        fetchRecommendationsByHero(hero.name)
          .then(res => {
            this.setState({ recommendationsList: res.results })
          })
          .then(() => {
            this.setState({isLoadingRecommendations: false})
          })
    }

    getRecommendationsByPower() {
      // extra loading state var
      this.setState({isLoadingRecommendations: true})

      this.setState({recommendationsModalOpen: true})

      fetchRecommendationsByPower(this.state.selectedPower)
        .then(res => {
          console.log('res: ', res)
          this.setState({ recommendationsList: res.results })
        })
        .then(() => {
          this.setState({isLoadingRecommendations: false})
        })
  }

    closeRecommendationsModal() {
        // reset the state of the modal
        this.setState({recommendationsModalOpen: false})

        // and reset the state of the recommendations list
        this.setState({recommendationsList: []})
    }

    heroColumns = [
      {
        title: 'Hero Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, row) => <Button onClick={(event) => this.getRecommendationsByHero(row)}>{text}</Button>
      },
      {
        title: 'Alignment',
        dataIndex: 'alignment',
        key: 'alignment',
        sorter: (a, b) => a.alignment.localeCompare(b.alignment)
      },
      {
        title: 'Publisher',
        dataIndex: 'Publisher',
        key: 'Publisher',
        sorter: (a, b) => a.publisher.localeCompare(b.publisher)
        },
    ];

      
  render() {
        
    return (
      <div>
         <MenuBar />

            <div style={{ padding: "30px", }} >
                <h1>The Bruicleona Recommendation Engine</h1>
            </div>      

            <div style={{ paddingLeft: "50px", }} >
                <p>Let me guess, you're looking for something to watch? Not to worry, we've got just what you need! </p>
                <p>The <span style={{ fontWeight: "bold"}}>Bruicleona Recommendation Engine</span> is a first-of-its kind software that will help you discover your next Superhero obsession. </p>
            </div>   

            <div style={{ paddingLeft: '50px', paddingBottom: '20px'}}>

              <Radio.Group onChange={(e) => this.setState({heroNameOrPower: e.target.value})} value={this.state.heroNameOrPower}>
                <Radio value='heroName'>Get Recommendations by Hero</Radio>
                <Radio value='power'>Get Recommendations by Power</Radio>
              </Radio.Group>

            </div>

        {

          this.state.heroNameOrPower === 'heroName' ?

          <div>
            <Row justify='between' style={{ justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px'}}>

                <Form style={{ marginLeft: '20px', marginTop: '20px' }}>

                    <Row>
                        <Col flex={2}>
                          <FormGroup style={{ width: '30vw', margin: '0 auto' }}>
                          <label>Search for a hero to start your recommendation journey!</label>
                            <FormInput placeholder="Hero Name" value={this.state.keywordSearch} onChange={this.onChangeOfKeyword} />
                          </FormGroup>
                        </Col>
                    </Row>

                    <br></br>

                  <Row>

                        <Col flex={2}>
                          <FormGroup style={{ }}>
                            <Button style={{ marginTop: '10px' }} onClick={this.updateSearchResults}>Show me heroes please!</Button>
                          </FormGroup>
                        </Col>

                    </Row>

                </Form>

              <div style={{ marginTop: '20px', width: '50%', margin: '0 auto'}} >
                <h3>Super Hero Results</h3>

                {
                  this.state.isLoading ? 
                    <div justify="center" align="center" width="100vh" height="100vh" style={{ margin: '0 auto', paddingTop: '20px'}}>
                      <Spin size="large" style={{ margin: '0 auto'}} />
                    </div>
                  :
                  <div>
                    <Table width="100%" dataSource={this.state.heroesResults} columns={this.heroColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 10, showQuickJumper:true }}/>
                  </div>
                }

              </div>

            </Row>


            <Modal open={this.state.recommendationsModalOpen} toggle={this.closeRecommendationsModal}>
              <div style={{ height: '75vh', overflow: 'auto'}}>
              <ModalHeader>Your Personal Recommendations</ModalHeader>
              <ModalBody>Based on your choice of <span style={{ fontSize: '18px', fontWeight: "bold"}}>{this.state.selectedHero.name}</span>, the Bruicleona recommendation selection would recommend that you check out....</ModalBody>
        
              <ModalBody>

              {this.state.isLoadingRecommendations && <div justify="center" align="center" width="100vh" height="100vh" style={{ margin: '0 auto', paddingTop: '20px'}}>
                  <Spin size="large" style={{ margin: '0 auto'}} />
                </div>}

                  <ListGroup>
                      {
                        this.state.recommendationsList.length > 0 ?
                        this.state.recommendationsList.map(rec => {
                           return <ListGroupItem><a href={`http://www.imdb.com/title/${rec.imdb_id}`} target="_blank">{rec.title}</a></ListGroupItem>
                        })
                        :
                         <div>Sorry, no results found for your selection. Please try a different selection!</div>
                      }
                  </ListGroup>                            

              </ModalBody>

              </div>
            </Modal>

        </div>

        : 

        <div>
        <Row justify='between' style={{ justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px'}}>

            <Form style={{ marginLeft: '20px', marginTop: '20px' }}>

                <Row>
                    <Col flex={2}>
                      <FormGroup style={{ width: '30vw', margin: '0 auto' }}>
                      <label>Select a power to start your recommendation journey!</label>
                        <Select size="large" defaultValue="Agility" style={{ width: 120 }} onChange={(val) => this.setState({selectedPower: val})}>
                              <Option value="Agility">Agility</Option>
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

                              <Option value="Omniscient">Omniscient</Option>
                              <Option value="Power_Suit">Power Suit</Option>
                              <Option value="Shapeshifting">Shapeshifting</Option>
                              <Option value="Stamina">Stamina</Option>
                              <Option value="Super_Speed">Super Speed</Option>
                              <Option value="Super_Strength">Super Strength</Option>
                              <Option value="Telepathy">Telepathy</Option>
                              <Option value="Teleportation">Teleportation</Option>
                              <Option value="Time_Travel">Time_Travel</Option>
                              <Option value="Vision-Xray">Xray-Vision</Option>
                          </Select>    
                        </FormGroup>
                    </Col>
                </Row>

                <br></br>

              <Row>
                    <Col flex={2}>
                      <FormGroup style={{ }}>
                        <Button style={{ marginTop: '10px' }} onClick={this.getRecommendationsByPower}>Show me my recommendations based on... {this.state.selectedPower}</Button>
                      </FormGroup>
                    </Col>
                </Row>

            </Form>

        </Row>


        <Modal open={this.state.recommendationsModalOpen} toggle={this.closeRecommendationsModal} >
        <div style={{ height: '75vh', overflow: 'auto'}}>

          <ModalHeader>Your Personal Recommendations</ModalHeader>
          <ModalBody>Based on your choice of <span style={{ fontSize: '18px', fontWeight: "bold"}}>{this.state.selectedPower}</span>, the Bruicleona recommendation selection would recommend that you check out....</ModalBody>
    
          <ModalBody>

            {this.state.isLoadingRecommendations && <div justify="center" align="center" width="100vh" height="100vh" style={{ margin: '0 auto', paddingTop: '20px'}}>
                  <Spin size="large" style={{ margin: '0 auto'}} />
                </div>}

                <ListGroup>
                      {
                        this.state.recommendationsList.length > 0 ?
                        this.state.recommendationsList.map(rec => {
                           return <ListGroupItem><a href={`http://www.imdb.com/title/${rec.imdb_id}`} target="_blank">{rec.title}</a></ListGroupItem>
                        })
                        :
                         <div>Sorry, no results found for your selection. Please try a different selection!</div>
                      }
                  </ListGroup>                             

          </ModalBody>
          </div>
        </Modal>

    </div>

        }
        
      </div>
    )
  }

}

export default RecommendationsPage
