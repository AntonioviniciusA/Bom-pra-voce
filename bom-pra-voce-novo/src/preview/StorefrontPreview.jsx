// Local visual verification entry; not imported by the public application.
import {BrowserRouter} from 'react-router-dom';
import Home from '../pages/Home';
export default function StorefrontPreview({offers}){return <BrowserRouter><Home offers={offers}/></BrowserRouter>}
