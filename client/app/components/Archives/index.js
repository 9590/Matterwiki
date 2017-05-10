import React from "react";
import { Link } from "react-router";
import { Row, Col, Grid } from "react-bootstrap";
import Loader from "Loader/index";
import BrowseArchives from "./BrowseArchives";
import SimpleArticle from "./SimpleArticle";
import API from "api/wrapper.js";

class ArticleHistory extends React.Component {
  constructor(props) {
    super(props);
    this.archiveUpdate = this.archiveUpdate.bind(this);
    this.state = {
      archives: [],
      article: {},
      loading: true,
      articleloading: false
    };
  }

  componentDidMount() {
    var that = this;
    API.call(
      "articles/" + this.props.params.articleId + "/history",
      "GET",
      window.localStorage.getItem("userToken")
    )
      .then(function(articles) {
        that.setState({ archives: articles.data, loading: false });
      })
      .catch(function(err) {
        //Alert.error(err)
      });
  }

  archiveUpdate(id) {
    this.setState({ articleloading: true });
    var that = this;
    API.call("archives/" + id, "GET", window.localStorage.getItem("userToken"))
      .then(function(archive) {
        that.setState({
          article: archive.data,
          isHtml: archive.data.body && !archive.data.body_json ? true : false,
          articleloading: false
        });
      })
      .catch(function(err) {
        //Alert.error(err)
      });
  }

  render() {
    if (this.state.loading) return <Loader />;
    else
      return (
        <Grid>
          <Row>
            <Col md={3}>
              <label>Archives</label>
              <BrowseArchives
                archives={this.state.archives}
                archiveChange={this.archiveUpdate}
                articleId={this.props.params.articleId}
              />
            </Col>
            <Col md={9}>
              <label>View Article</label>
              <SimpleArticle
                article={this.state.article}
                loading={this.state.articleloading}
                isHtml={this.state.isHtml}
              />
            </Col>
          </Row>
        </Grid>
      );
  }
}

export default ArticleHistory;
