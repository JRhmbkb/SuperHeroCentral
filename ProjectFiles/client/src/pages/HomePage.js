import React from 'react';
import { Form, FormInput, FormGroup, Button } from "shards-react";
import {
  Table,
   Row,
   Col,
  Spin
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllHeroes } from '../fetcher'


const heroColumns = [
  {
    title: 'Hero Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: ((text, row) => row.Publisher === 'Marvel' ? <a target="_blank" href={`http://www.marvel.fandom.com/wiki${row.urlslug?.substring(1)}`}>{text}</a> : <div>{text}</div>),
  },
  {
    title: 'Alignment',
    dataIndex: 'alignment',
    key: 'alignment',
    sorter: (a, b) => a.alignment.localeCompare(b.alignment)
  },
  {
    title: 'Eye Color',
    dataIndex: 'eye_color',
    key: 'eye_color',
    sorter: (a, b) => a.eye_color.localeCompare(b.eye_color)
    },
    {
      title: 'Hair Color',
      dataIndex: 'hair_color',
      key: 'hair_color',
      sorter: (a, b) => a.hair_color.localeCompare(b.hair_color)
      },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => a.gender.localeCompare(b.gender)
      },
      {
        title: 'Publisher',
        dataIndex: 'Publisher',
        key: 'Publisher',
        sorter: (a, b) => a.publisher.localeCompare(b.publisher)
        },
];

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      heroesResults: [],
      keywordSearch: "",
      isLoading: true

    }

    this.onChangeOfKeyword = this.onChangeOfKeyword.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
  
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

      
  render() {
          
    return (
      <div>
        
         <MenuBar />
            <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                <Row>
                    <Col flex={2}>
                      <FormGroup style={{ width: '60vw', margin: '0 auto' }}>
                        <h1 style={{ paddingBottom: '10px'}}>
                          <span style={{ color: 'green '}}>H</span>
                          <span style={{ color: '#eab573'}}>e</span>
                          <span style={{ color: 'blue'}}>r</span>
                          <span style={{ color: 'red'}}>o</span>
                          <span style={{ color: '#eab573'}}>o</span>
                          <span style={{ color: 'blue'}}>g</span>
                          <span style={{ color: 'green'}}>l</span>
                          <span style={{ color: 'red'}}>e</span>
                        </h1>
                        <label>Try searching for heroes! (e.g. 'Batman')</label>
                        <FormInput placeholder="Hero Name" value={this.state.keywordSearch} onChange={this.onChangeOfKeyword} />
                      </FormGroup>
                    </Col>

                </Row>

                <br></br>

                <Row>

                    <Col flex={2}>
                      <FormGroup style={{ width: '10vw', margin: '0 auto' }}>
                        <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                      </FormGroup>
                    </Col>

                </Row>


            </Form>

          <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
            <h3>Super Hero Results</h3>

            {
              this.state.isLoading ? 
                <div justify="center" align="center" width="100vh" height="100vh" style={{ margin: '0 auto', paddingTop: '20px'}}>
                  <Spin size="large" style={{ margin: '0 auto'}} />
                </div>
              :
                <Table dataSource={this.state.heroesResults} columns={heroColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 10, showQuickJumper:true }}/>
            }

          </div>
        
      </div>
    )
  }

}

export default HomePage

