import React, { Component } from 'react';
import {
  Col,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import _ from 'lodash';
class InspectModule {
  constructor() {
      this.inspect = {};
  }
  set(obj) {
      if (obj.inspect) {
          this.inspect = _.merge({}, this.inspect, obj.inspect);
      }
  }
}

const getTags = function (postParsed) {
  return postParsed.filter(function (part) {
      return part.type === "placeholder";
  }).reduce(function (tags, part) {
      tags[part.value] = {};
      if (part.subparsed) {
          tags[part.value] = getTags(part.subparsed);
      }
      return tags;
  }, {});
}
const FormFill = React.lazy(() => import('../Base/FormFill/FormFill'));

class GenDocx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

generate(file) {
    var reader = new FileReader();
    const thiz = this;
    reader.onload = function(){
      const arrayBuffer = this.result;
      // thiz.setState({arrayBuffer: this.result});
      // document.querySelector('#result').innerHTML = arrayBuffer + '  '+arrayBuffer.byteLength;
      var zip = new window.PizZip(arrayBuffer);
      var doc=new window.docxtemplater().loadZip(zip)
      thiz.setState({doc: doc});
      try {
        let inspectModule = new InspectModule();
        doc.attachModule(inspectModule);
        doc.render();
        let postParsed = inspectModule.inspect.postparsed;
        const tagsArray = [...new Set(Object.keys(getTags(postParsed)))];
        thiz.setState({ ...this.state, tags: tagsArray});
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }
    }
    
    reader.readAsArrayBuffer(file);
}

  handleFile = e => {
    this.setState({ ...this.state, fileinputname: e.target.files[0].name });
    this.generate(e.target.files[0]);
  };

  onChange = e => {
    let name = e.target.id;
    name = 'tags.' + name;
    this.setState({ ...this.state, [name]: e.target.value });
  };

  onReset = () => {
    // e.preventDefault();
    this.state.tags.forEach(tag => {
      this.setState({ [`tags.${tag}`]: undefined });
    });
  };

  handleSubmit = e => {
    // e.preventDefault();
    console.log(this.state);
    const results = {};
    this.state.tags.forEach(tag => {
      results[tag] = this.state[`tags.${tag}`]
    })
    console.log(results);
    this.state.doc.setData(results);
    try {
      this.state.doc.render();
    }
    catch (error) {
        var er = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: er}));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }
    var out = this.state.doc.getZip().generate({
        type:"blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }) //Output the document using Data-URI
    const fileNameOutput = this.state.fileinputname.replace('.docx', `.${+ new Date()}.docx`);
    window.saveAs(out, fileNameOutput)
  };

  render() {
    const tags = this.state.tags;
    return (
      <div className="animated fadeIn">
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="fileinput">File input</Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="file" id="fileinput" name="fileinput" 
            onChange={this.handleFile}/>
          </Col>
        </FormGroup>
        <FormFill tags={tags} onSubmit={this.handleSubmit} onChange={this.onChange} onReset={this.onReset}/>
      </div>
    );
  }
}

export default GenDocx;
