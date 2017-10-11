import React, {Component} from 'react'


class RecentSubmissions extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
  }

  renderSubmission(submission) {
    return (
      <div className="submission" key={submission.hashId}>
        <div className="pure-g">
          <div className="pure-u-8-24">
            <label>Id:</label>
            <span className="submission-id">{submission.hashId}</span>
          </div>
          <div className="pure-u-8-24">
            <label>Title:</label>
            <span className="submission-title">{submission.title}</span>
          </div>
          <div className="pure-u-8-24">
            <label>Full Name:</label>
            <span className="submission-full-name">{submission.fullName}</span>
          </div>
          <div className="pure-u-5-5">
            <p className="submission-text">{submission.text}</p>
          </div>
          <div className="pure-u-5-5">
            <label>Sent from:</label>
            <span className="submission-sender">{submission.sender}</span>
          </div>
          <div className="pure-u-5-5">
            <label>IPFS Hash:</label>
            <a className="submission-hash-content"   target="_blank"
               href={`https://ipfs.infura.io:5001/api/v0/cat/${submission.hashContent}`}>{submission.hashContent}</a>
          </div>
          <div className="pure-u-5-5">
            <label>Timestamp:</label>
            <span className="submission-timestamp" href="">{submission.timestamp} / {new Date(submission.timestamp*1000).toISOString()}</span>
          </div>
        </div>
      </div>);
  }

  render() {
    return (
      <div className="RecentSubmissions">
        {this.props.submissions.map((submission) => this.renderSubmission(submission))}
      </div>
    );
  }
}

export default RecentSubmissions;
