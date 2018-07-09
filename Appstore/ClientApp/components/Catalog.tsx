import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as CatalogState from '../store/GameCatalog';
import { connect } from 'react-redux';

// At runtime, Redux will merge together...
type CatalogProps =
    CatalogState.CatalogState        // ... state we've requested from the Redux store
    & typeof CatalogState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ filter: string, currentEntry: CatalogState.CatalogEntry }>; // ... plus incoming routing parameters

class Catalog extends React.Component<CatalogProps, {search: string}> {

    constructor(props) {
        super(props);
        this.state =
        {
            search: this.props.match.params.filter ||  ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.showDetails = this.showDetails.bind(this);

        this.props.requestCatalog('INITIAL_SEARCH');
        this.props.requestEntry('INITIAL_ENTRY');
    }

    public render()
    {
        return (
            <div>
                <h1>Duh Catalog</h1>
                <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
                <input type="text" value={this.state.search} onChange={this.handleChange} />
                {this.renderCatalogTable()}
            </div>
        );
    }

    private renderCatalogTable() {
        return <ul className='catalog'>
            {this.props.catalog.map(catalog =>
                <li key = {catalog.id} onClick={() => this.showDetails(catalog.id)}>
                    <h1>{catalog.title}</h1>
                    <p>{catalog.description}</p>     
                </li>
            )}
        </ul>
    }

    showDetails(id)
    {
        this.props.requestEntry(id);
      
        
        //These logs seem to complete before the requestEntry does
        //Meaning currentEntry will still be undefined here
        console.log("Current Entry:");
        console.log(this.props.currentEntry);

        this.props.history.push(`catalog-entry/${id}`);
        
    }

    handleChange(event) {
        //Probably debounce here
        this.setState(
            {
                search: event.target.value,
            });  
        
        this.props.requestCatalog(this.state.search);
    }

}

export default connect(
    (state: ApplicationState) => state.catalogEntries, // Selects which state properties are merged into the component's props
    CatalogState.actionCreators                 // Selects which action creators are merged into the component's props
)(Catalog) as typeof Catalog;
