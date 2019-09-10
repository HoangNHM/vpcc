import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

class FormFill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.props.tags) {
      return <div>
        Choose a docx file
      </div>;
    }
    const tags1 = this.props.tags.slice(0, Math.round(this.props.tags.length / 2));
    const tags2 = this.props.tags.slice(tags1.length, this.props.tags.length);
    return (
      <div className="animated fadeIn">
              <Form className="was-validated" onSubmit={this.props.onSubmit}>
        <Row>
          <Col xs="12" sm="6">
            <Card>
              <CardBody>
                {tags1.map((tag) => 
                  <FormGroup>
                    <Label htmlFor={tag}>{tag}</Label>
                    <Input onChange={this.props.onChange} type="text" id={tag} required/>
                  </FormGroup>
              )}
              </CardBody>
            </Card>
          </Col>
          {tags2.length > 0 &&
            <Col xs="12" sm="6">
              <Card>
                <CardBody>
                  {tags2.map((tag) => 
                    <FormGroup>
                      <Label htmlFor={tag}>{tag}</Label>
                      <Input onChange={this.props.onChange} type="text" id={tag} required/>
                    </FormGroup>
                )}
                </CardBody>
              </Card>
            </Col>
          }
        </Row>
        <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
        <Button type="reset" onClick={this.props.onReset} size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
        </Form>
      </div>
    );
  }
}

export default FormFill;
