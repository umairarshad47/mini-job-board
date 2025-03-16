import {Helmet} from "react-helmet";

const DocumentTitle = (props) => {
    const { title } = props;

    return (
        <div>
            <Helmet>
                <title>Job Board | {title}</title>
            </Helmet>
        </div>
    )
}

export default DocumentTitle;