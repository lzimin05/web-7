import React from 'react';
import './styles.scss';

export default function RequestCard(props) {

    const [queryParamsValue, setQueryParamsValue] = React.useState({});
    const [bodyParamsValue, setBodyParamsValue] = React.useState({});
    const [requestUrl, setRequestUrl] = React.useState(props.url);
    const [response, setResponse] = React.useState(null);

    function updateRequestURL(queryParams) {
        let queryComponents = [];
        for (let queryKey of props.query ?? []) {
            queryComponents.push(`${queryKey}=${encodeURIComponent(queryParams[queryKey] ?? "")}`);
        }
        setRequestUrl(`${props.url}${queryComponents.length > 0 ? "?" : ""}${queryComponents.join("&")}`);
    }

    function getRequestForm(formParams) {
        let formData = new FormData();
        for (let formKey of props.body ?? []) {
            formData.append(formKey, formParams[formKey] ?? "");
        }
        return formData;
    }

    function updateQueryParamValue(event) {
        let newQueryParams = {
            ...bodyParamsValue,
            [event.target.name]: event.target.value,
        };
        setQueryParamsValue(newQueryParams);
        updateRequestURL(newQueryParams);
    }

    function updateBodyParamValue(event) {
        setBodyParamsValue(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    function sendRequest() {
        setResponse({ send: true })
        if (props.method == "GET") {
            fetch(`http://${requestUrl}`,).then(async (response) => {
                let responseValue = await response.text();
                let responseStatus = response.status;
                setResponse({ status: responseStatus, value: responseValue });
            }).catch((err) => {
                setResponse({ status: 500, value: "Ошибка соединения!" });
            })
        } else {
            fetch(`http://${requestUrl}`, {
                method: 'POST',
                body: getRequestForm(bodyParamsValue)
            }).then(async (response) => {
                let responseValue = await response.text();
                let responseStatus = response.status;
                setResponse({ status: responseStatus, value: responseValue });
            }).catch((err) => {
                setResponse({ status: 500, value: "Ошибка соединения!" });
            })
        }
    }

    React.useEffect(() => {
        updateRequestURL(bodyParamsValue);
    }, []);

    return (
        <div className="request-card">
            <div className='header'>
                <div className={`method ${props.method}`}>
                    {props.method}
                </div>
                <code className='url'>{requestUrl}</code>
                <button className='run' onClick={() => sendRequest()}>Run</button>
            </div>
            {props.query && <div className='properties'>
                <div className='title'>
                    Query Params:
                </div>
                <div className='list'>
                    {
                        props.query.map((queryParam) => (
                            <>
                                <span className='property-name'>{queryParam}:</span>
                                <input className='property-value' name={queryParam} onChange={(ev) => updateQueryParamValue(ev)} />
                            </>
                        ))
                    }
                </div>
            </div>}
            {props.body && <div className='properties'>
                <div className='title'>
                    Form Params:
                </div>
                <div className='list'>
                    {
                        props.body.map((queryParam) => (
                            <>
                                <span className='property-name'>{queryParam}:</span>
                                <input className='property-value' name={queryParam} onChange={(ev) => updateBodyParamValue(ev)} />
                            </>
                        ))
                    }
                </div>
            </div>}
            {response && response.status && <div className={`output ${!props.query && !props.body ? "no-border" : ""}`}>
                <div className='title'>
                    <span>Result:</span>
                    <span className={`status ${response && response.status == 200 ? "success" : ""}`}>Статус: {response.status}</span>
                </div>
                {response.value != ""
                    ? <div className='response'>
                        {response.value}
                    </div>
                    : <div className='response empty'>
                        [Ответ пустой]
                    </div>
                }
            </div>}

            {response && response.send && <div className={`output ${!props.query && !props.body ? "no-border" : ""}`}>
                <div className='title'>
                    <span>Waiting response...</span>
                </div>
            </div>}
        </div >
    )
}
