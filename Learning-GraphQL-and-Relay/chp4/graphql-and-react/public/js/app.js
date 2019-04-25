import React from 'react';
import ReactDOM from 'react-dom';
import Quote from './quote';

class QuoteLibrary extends React.Component {
    state = {
        allQuotes: []
    };

    componentDidMount() {
        const query = `{
            allQuotes {
              id 
              text 
              author
            }
        }`;
        const baseUrl = window.location.origin; // http://localhost:3000
        //const baseUrl = window.location.host; // localhost:3000
        fetch(`${baseUrl}/graphql?query=${query}`)
        .then(response => response.json())
        .then(json => this.setState(json.data))
        .catch(ex => console.error(ex));
    }

    render() {
        return (
            <div className="quote-list">
                {this.state.allQuotes.map(quote => 
                    <Quote key={quote.id} quote={quote} />
                )}
            </div>
        )
    }
}

ReactDOM.render(<QuoteLibrary />, document.getElementById('react'));