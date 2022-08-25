import React from 'react';
import marvel from './marvel.jpg';
import dc from './dc.jpg';
import { Form, FormInput, FormGroup, Button  } from "shards-react";
import {
  Table,
  Image,
  Pagination,
   Select,
   Row,
   Col,
   Radio,
 
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAlignment, getIdentityMarvel, getIdentityDC, getAliveStatusMarvel, getAliveStatusDC } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;


class MarvelVsDCPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      alignmentMarvelResults: [],
      alignmentDCResults: [],
      identityMarvelResults: [],
      identityDCResults: [],
      aliveMarvelResults: [],
      aliveDCResults: [],
      alignmentSelection: "good",
      identitySelection: "public",
      aliveSelection: "living",
      comparisonChoice: 'alignment',
      pagination: null,
    }
    this.onAlignmentClick = this.onAlignmentClick.bind(this)
    this.onAlignmentSelect = this.onAlignmentSelect.bind(this)
    this.onIdentityClick = this.onIdentityClick.bind(this)
    this.onIdentitySelect = this.onIdentitySelect.bind(this)
    this.onAliveClick = this.onAliveClick.bind(this)
    this.onAliveSelect = this.onAliveSelect.bind(this)
  }

  onAlignmentClick() {
    getAlignment(this.state.alignmentSelection, this.state.alignmentSelection).then(res => {
        this.setState({ alignmentMarvelResults: res.results[0] })
    })
    getAlignment(this.state.alignmentSelection, this.state.alignmentSelection).then(res => {
      this.setState({ alignmentDCResults: res.results[1] })
  })
}
  onIdentityClick() {
    getIdentityMarvel(this.state.identitySelection, this.state.identitySelection).then(res => {
        this.setState({ identityMarvelResults: res.results[0] })
    })
    getIdentityDC(this.state.identitySelection, this.state.identitySelection).then(res => {
      this.setState({ identityDCResults: res.results[0] })
  })
  }
  onAliveClick() {
    getAliveStatusMarvel(this.state.aliveSelection, this.state.aliveSelection).then(res => {
        this.setState({ aliveMarvelResults: res.results[0] })
    })
    getAliveStatusDC(this.state.aliveSelection, this.state.aliveSelection).then(res => {
      this.setState({ aliveDCResults: res.results[0] })
  })
  }

  onAlignmentSelect(value) {
    this.setState({ alignmentSelection: value})
}
  onIdentitySelect(value) {
    this.setState({ identitySelection: value})
  }
  onAliveSelect(value) {
    this.setState({ aliveSelection: value})
  }


    heroColumns = [
        {
          title: 'Hero Name',
          dataIndex: 'heroName',
          key: 'Hero Name',
        //   sorter: (a, b) => a.Hero_Name.localeCompare(b.Hero_Name),
          render: (text, row) => <Button onClick={(event) => this.getRecommendationsByHero(row)}>{text}</Button>
        },
        {
          title: 'Identity',
          dataIndex: 'identity',
          key: 'Identity',
        //   sorter: (a, b) => a.Identity.localeCompare(b.Identity)
        },
        {
          title: 'Alignment',
          dataIndex: 'alignment',
          key: 'Alignment',
            sorter: (a, b) => a.Alignment - b.Alignment
          
          },
          { // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
          title: 'Alive',
          dataIndex: 'Alive',
          key: 'Alive',
        //   sorter: (a, b) => a.Gender - b.Gender
      
          }
       
      ];

    render() {

     
        return (
            <div>

                <MenuBar />

                    <div style={{ padding: "30px", }} >
                        <h1>Marvel vs. DC</h1>
                        <h4>The Battle of the Super Hero Publishers</h4>
                    </div>      
         
                      
                                  <div style={{ paddingBottom: '20px', margin: '0 auto', textAlign: 'center' }}>
                                  <span style={{ fontWeight: 'bold', fontSize: '22px'}}>Select a category to compare Marvel and DC...</span>
                                    {/* <label>Select a category to compare Marvel and DC...</label> */}
                                   
                                  </div>
                                  <div style={{ paddingBottom: '20px', textAlign: 'center'}}>

                                      <Radio.Group onChange={(e) => this.setState({comparisonChoice: e.target.value})} value={this.state.comparisonChoice}>
                                          <Radio style = {{fontSize: '22px'}} value='alignment'>Alignment</Radio>
                                          <Radio style = {{fontSize: '22px'}} value='identity'>Identity</Radio>
                                          <Radio style = {{fontSize: '22px'}} value='alive'>Life Status</Radio>
                                      </Radio.Group>

                                  </div>

                                  {

                                      this.state.comparisonChoice === 'alignment' ?

                                      <div style = {{ paddingBottom: '20px', textAlign: 'center' }}>

                                                  <div style={{ width: '30vw', margin: '0 auto', textAlign: 'center' }}>
                                                  <div style={{ marginRight: '20px'}}><label>Select alignment!</label></div>
                                                    <Select size="large" defaultValue="good" value={this.state.alignmentSelection} style={{ width: 120 }} onChange={(val) => this.setState({alignmentSelection: val})}>
                                                          <Option style = {{fontSize: '16px'}}value="good">Good</Option>
                                                          <Option style = {{fontSize: '16px'}}value="neutral">Neutral</Option>
                                                          <Option style = {{fontSize: '16px'}}value="bad">Bad</Option>
                                              
                                                      </Select>    
                                                    </div>

                                            <br></br>
                  
                                                    <Button style={{ marginTop: '10px' }} onClick={this.onAlignmentClick}>Compare by Alignment</Button>
                                                
                          
                                                <Row style={{ paddingTop: "50px"}}>
                                                
                                                <Col flex={2}>
                                                <Image width={125} height={125} src = {marvel}/>
                                                  <h3>Marvel Count</h3>

                                                  <h3>{this.state.alignmentMarvelResults?.percentage > 0 && `${this.state.alignmentMarvelResults.percentage}%`}</h3> 
                                                  <h4>{this.state.alignmentMarvelResults?.num > 0 && `${this.state.alignmentMarvelResults.num} Heroes`}</h4>


                                                </Col>

                                                <Col flex={2}>
                                                <Image width={125} height={125} src = {dc}/>
                                                  <h3>DC Count</h3>
                                                 
                                                  <h3>{this.state.alignmentDCResults?.percentage > 0 && `${this.state.alignmentDCResults.percentage}%`}</h3> 
                                                  <h4>{this.state.alignmentDCResults?.num > 0 && `${this.state.alignmentDCResults.num} Heroes`}</h4> 

                                                </Col>

                                                </Row>




                                      </div>

                                      

                                      : 

                                      this.state.comparisonChoice === 'identity' ?
                                            <div style={{ paddingBottom: '20px', textAlign: 'center' }}>

                                                 <div style={{ width: '30vw', margin: '0 auto', textAlign: 'center' }}>
                                                 <div style={{ marginRight: '10px'}}> <label>Select identity!</label></div>
                                                    <Select size="large" defaultValue="secret" value={this.state.identitySelection} style={{ width: 120 }} onChange={(val) => this.setState({identitySelection: val})}>
                                                          <Option style = {{fontSize: '16px'}} value="secret">Secret</Option>
                                                          <Option style = {{fontSize: '16px'}} value="public">Public</Option>
                                             
                                                      </Select>    
                                                      </div>
                                            <br></br>


                                                    <Button style={{ marginTop: '10px' }} onClick={this.onIdentityClick}>Compare by Identity</Button>

                                                <Row style={{ paddingTop: "50px"}}>
                                                
                                                <Col flex={2}>
                                                <Image width={125} height={125} src = {marvel}/>
                                                  <h3>Marvel Count</h3>

                                                  <h3>{this.state.identityMarvelResults?.percentage > 0 && `${this.state.identityMarvelResults?.percentage}%`}</h3> 
                                                  <h4>{this.state.identityMarvelResults?.num > 0 && `${this.state.identityMarvelResults?.num} Heroes`} </h4> 

                                                  </Col>


                                                  <Col flex={2}>
                                                  <Image width={125} height={125} src = {dc}/>

                                                  <h3>DC Count</h3>


                                                  <h3>{this.state.identityDCResults?.percentage > 0 && `${this.state.identityDCResults?.percentage}%`}</h3> 
                                                  <h4>{this.state.identityDCResults?.num > 0 && `${this.state.identityDCResults?.num} Heroes`} </h4> 

                                                  </Col>

                                                  </Row>






                                      </div>
                          
                                      :

                                      <div style={{ textAlign: 'center'}}>


                                                  <div style={{ width: '30vw', margin: '0 auto', textAlign: 'center' }}>
                                                  <div style={{ textAlign: 'center'}}><label>Select status!</label></div>
                                                    <Select size="large" defaultValue="living" value={this.state.aliveSelection} style={{ width: 120 }} onChange={(val) => this.setState({aliveSelection: val})}>
                                                          <Option style = {{fontSize: '16px'}} value="living">Living</Option>
                                                          <Option style = {{fontSize: '16px'}} value="deceased">Deceased</Option>
                                                         
                                             
                                                      </Select>    
                                                      </div>
                                            <br></br>

                                                    <Button style={{ marginTop: '10px' }} onClick={this.onAliveClick}>Compare by Life Status</Button>

                                                <Row style={{ paddingTop: "50px"}}>
                                                
                                                <Col flex={2}>
                                                <Image width={125} height={125} src = {marvel}/>
                                                  <h3>Marvel Count</h3>



                                                  <h3>{this.state.aliveMarvelResults?.percentage > 0 && `${this.state.aliveMarvelResults?.percentage}%`}</h3> 
                                                  <h4>{this.state.aliveMarvelResults?.num > 0 && `${this.state.aliveMarvelResults?.num} Heroes`} </h4> 


                                                </Col>

                                                <Col flex={2}>
                                                <Image width={125} height={125} src = {dc}/>
                                                  <h3>DC Count</h3>
                                                  

                                                  <h3>{this.state.aliveDCResults?.percentage > 0 && `${this.state.aliveDCResults?.percentage}%`}</h3> 
                                                  <h4>{this.state.aliveDCResults?.num > 0 && `${this.state.aliveDCResults?.num} Heroes`} </h4> 

                                                  <h3 style={{ color: this.state.scoreResults2?.total_score <= this.state.scoreResults1?.total_score ? 'black' : 'white'}}>{this.state.scoreResults2?.power_hero_name}</h3> 
                                   

                                                </Col>

                                            </Row>


                                      </div>
                          
                                      }

                  
             
                
            </div>
        )
    }
}

export default MarvelVsDCPage

