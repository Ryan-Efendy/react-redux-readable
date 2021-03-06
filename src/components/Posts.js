import React, { Component } from 'react';
import { Button, Feed, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { fetchPosts, incrementLikes, decrementLikes } from '../actions';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts();
  }

  sortBy = posts =>
    this.props.activeSort === 'mostPopular'
      ? _.reverse(_.sortBy(posts, 'voteScore'))
      : _.reverse(_.sortBy(posts, 'timestamp'));

  renderPosts = category => {
    if (!_.isEmpty(this.props.posts)) {
      const posts =
        !category || category === 'all'
          ? this.sortBy(this.props.posts)
          : this.sortBy(
              _.filter(this.props.posts, post => post.category === category)
            );
      // if (posts.length === 0 || _.isEmpty(posts)) {
      //   return (
      //     <div>
      //       <h3>
      //         No post availabel for ${category} category
      //       </h3>
      //     </div>
      //   );
      // }
      return _.map(posts, post => {
        if (!post.deleted) {
          return (
            <Feed.Event key={post.id}>
              <Feed.Label style={{ width: '7.5em' }}>
                <img src="https://source.unsplash.com/random/73x73" alt="" />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{post.author}</Feed.User> in <a>{post.category}</a>
                  <Feed.Date>{moment(post.timestamp).fromNow()}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{post.title}</Feed.Extra>
                <Feed.Meta>
                  <Feed.Like
                    onClick={this.props.incrementLikes.bind(null, post.id)}
                  >
                    <Icon name="thumbs up" />
                  </Feed.Like>
                  <Feed.Like
                    onClick={this.props.decrementLikes.bind(null, post.id)}
                  >
                    <Icon name="thumbs down" />
                  </Feed.Like>
                  <Feed.Like>{post.voteScore}</Feed.Like>
                  <Link to={`/${post.category}/${post.id}`}>
                    <Button
                      secondary
                      floated="right"
                      size="mini"
                      content="Details"
                      icon="comments"
                      style={{ marginLeft: '1em' }}
                    />
                  </Link>
                  <Link to={`/edit/${post.id}`}>
                    <Button
                      primary
                      floated="right"
                      size="mini"
                      content="Edit"
                      icon="write"
                      style={{ marginLeft: '10em' }}
                    />
                  </Link>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>
          );
        }
      });
    }
  };

  render() {
    const { posts } = this.props;
    if (!posts || _.isEmpty(posts)) {
      return <div>Loading...</div>;
    }

    return <Feed>{this.renderPosts(this.props.activeCategory)}</Feed>;
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
});

const mapDispatchToProps = dispatch => ({
  fetchPosts: () => dispatch(fetchPosts()),
  incrementLikes: id => dispatch(incrementLikes(id)),
  decrementLikes: id => dispatch(decrementLikes(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts);
