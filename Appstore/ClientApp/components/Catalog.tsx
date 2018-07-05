import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as CatalogState from '../store/GameCatalog';
import { connect } from 'react-redux';

// At runtime, Redux will merge together...
type CatalogProps =
    CatalogState.CatalogState        // ... state we've requested from the Redux store
    & typeof CatalogState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ filter: string }>; // ... plus incoming routing parameters

class Catalog extends React.Component<CatalogProps, {search: string }> {

    constructor() {
        super();
        this.state = {
            search: 'Filter',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        // This method runs when the component is first added to the page
        let filter = this.props.match.params.filter;
        filter = "";
        this.props.requestCatalog(filter);
    }

    componentWillReceiveProps(nextProps: CatalogProps) {
        // This method runs when incoming props (e.g., route params) change
        let filter = nextProps.match.params.filter;
        this.props.requestCatalog(filter);
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
                <li key = { catalog.id}>
                    <h1>{catalog.title}</h1>
                    <p>{catalog.description}</p>
                </li>
            )}
        </ul>;
    }

    handleChange(event) {
        this.setState(
            {
                search: event.target.value,
            });
        console.log(this.state.search);
    }

    /*
    private renderPagination() {
        let prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
        let nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/fetchdata/${ prevStartDateIndex }` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/fetchdata/${ nextStartDateIndex }` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
    */
}


export default connect(
    (state: ApplicationState) => state.catalogEntries, // Selects which state properties are merged into the component's props
    CatalogState.actionCreators                 // Selects which action creators are merged into the component's props
)(Catalog) as typeof Catalog;
