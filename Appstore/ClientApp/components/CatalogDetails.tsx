import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as CatalogState from '../store/GameCatalog';
import { connect } from 'react-redux';

type CatalogDetailsProps =
    CatalogState.CatalogState        // ... state we've requested from the Redux store
    & typeof CatalogState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ filter: string }>; // ... plus incoming routing parameters

class CatalogDetails extends React.Component<CatalogDetailsProps, {}> {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps: CatalogDetailsProps) {
        // This method runs when incoming props (e.g., route params) change
        //this.props.requestCatalog(this.state.search);
    }

    public render()
    {
        return (
            <div>
                <h1>Catalog Entry</h1>

            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.catalogEntries, // Selects which state properties are merged into the component's props
    CatalogState.actionCreators                 // Selects which action creators are merged into the component's props
)(CatalogDetails) as typeof CatalogDetails;
