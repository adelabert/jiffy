import React, {Component} from 'react';
import Header from './Header';
import loader from './images/loader.svg'
import Gif from './components/Gif';


const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} /> : hintText }
  </div>
);

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchText: '',
      hintText: 'Hit enter to search',
      gif: null,
      gifs: [],
      loading: false
    }
  }

  handleChange = event => {
    const {value} = event.target;
    // console.log(event.target.value);
    // console.log(value);
    this.setState((prevState, props) => ({
      ...prevState,
      searchText: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
    
  };

  // API
  getData = async searchText => {

    this.setState({
      loading: true
    });

    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=QbTjm01E0HUFWROdDAxLMHeDV9D54FIG&limit=25&offset=0&rating=g&lang=en&q=${searchText}`);
      const {data}= await response.json();
      
      // handle empty
      if(data.length < 1){
        throw `${searchText} Not found`;
      }


      // random result
      const ranGif = randomChoice(data);

      // set gif to global val
      this.setState((prevState, props) => ({
        ...prevState,
        gif: ranGif,
        // old, add new (append)
        gifs: [...prevState.gifs, ranGif],
        loading: false,
        hintText:  `Hit enter to search more ${searchText}`

      }));
      // console.log(data);
    } catch (error) {
      // console.log(error);

      this.setState((prevState, props) => ({
        ...prevState,
      
        loading: false,
        hintText: error

      }));
    }
  }

  handleKeypress = event => {
    const {value} = event.target;

    if(value.length > 2 && event.key === 'Enter'){
      console.log('search');
      this.getData(value);
    }
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchText: '',
      hintText: 'Hit enter to search',
      gif: null,
      gifs: [],
      loading: false
    }));

    // set focus cursor / not use document.blalba --> use refs
    // document.querySelector('input').focus();

    this.textInput.focus();

  };

  render(){
    const { searchText, gif, gifs } = this.state
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        
        <div className="search grid">
          {/* single */}
          {/* {gif && (
            <video 
              className="grid-item video"
              autoPlay
              loop
              src={gif.images.original.mp4}
            />
          )} */}

          {
            gifs && gifs.map(gif => (
              <Gif {...gif}/>
            ))
          }
          
          <input 
            type="text" 
            className="input grid-item" 
            placeholder="type something" 
            onChange={this.handleChange} 
            onKeyPress={this.handleKeypress} 
            value={searchText}
            ref={input => {
              this.textInput = input
            }}
            />
        </div>

        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
